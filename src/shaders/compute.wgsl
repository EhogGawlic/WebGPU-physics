@group(0) @binding(0) var<storage, read_write> poss: array<Ball>;

struct Ball {
    pos: vec2<f32>, // Position of the ball
    ppos: vec2<f32>, // Previous position of the ball
    vel: vec2<f32>, // Velocity of the ball
    rad: f32,       // Radius of the ball
    mass: f32       // Mass of the ball
}

@compute @workgroup_size(1) fn main(
        @builtin(global_invocation_id) id: vec3u
) {
    let iid = id.x;

    // Verlet integration
    poss[iid].vel = poss[iid].pos - poss[iid].ppos+vec2<f32>(0, 9.81/60.0); // Calculate velocity
    poss[iid].ppos= poss[iid].pos; // Store previous position
    poss[iid].pos = poss[iid].pos+poss[iid].vel; // Update position with velocity
    let tpos: vec2<f32> = poss[iid].pos;
    let tvel: vec2<f32> = poss[iid].vel;

    // Collision resolution
    for (var j: u32 = 0u; j < 4u; j = j + 1u) {
        for (var i: u32 = 0u; i < arrayLength(&poss); i = i + 1u) {
            if (i == iid) {
                continue;
            }

            let pos: vec2<f32> = poss[i].pos;
            let dist: f32 = length(pos - tpos);
            let sd: f32 = poss[i].rad + poss[iid].rad;

            if (dist < sd) {
                let collNorm: vec2<f32> = normalize(pos - tpos); // Collision normal
                let adjdist: f32 = clamp(dist - sd, -5.0, 0.0); // Limit the maximum overlap correction

                // Determine relative weights based on radii
                let b1b: bool = poss[iid].rad > poss[i].rad;
                var nw1: f32 = 0.0;
                var nw2: f32 = 0.0;

                if (b1b) {
                    nw1 = poss[iid].mass * (poss[iid].rad / poss[i].rad);
                    nw2 = poss[i].mass;
                } else {
                    nw1 = poss[iid].mass;
                    nw2 = poss[i].mass * (poss[i].rad / poss[iid].rad);
                }

                let mb: f32 = 1.0 / (nw1 + nw2); // Mass balance
                let ad1: f32 = mb * nw2; // Adjustment factor for ball 1
                let ad2: f32 = mb * nw1; // Adjustment factor for ball 2

                let rmb: f32 = 1.0 / (poss[iid].rad + poss[i].rad); // Radius mass balance
                let rm1: f32 = rmb * poss[iid].rad; // Radius factor for ball 1
                let rm2: f32 = rmb * poss[i].rad;  // Radius factor for ball 2

                // Positional correction
                poss[iid].pos -= collNorm * (-ad1 * rm1 * adjdist);
                poss[i].pos -= collNorm * (ad2 * rm2 * adjdist);
            }
        }

        // Boundary collisions
        if (poss[iid].pos.x - poss[iid].rad < 0.0 || poss[iid].pos.x + poss[iid].rad > 600.0) {
            poss[iid].pos.x = clamp(poss[iid].pos.x, poss[iid].rad, 600.0 - poss[iid].rad);
            poss[iid].ppos.x = poss[iid].pos.x+poss[iid].vel.x*0.2; // Reset previous position
        }
        if (poss[iid].pos.y - poss[iid].rad < 0.0 || poss[iid].pos.y + poss[iid].rad > 400.0) {
            poss[iid].pos.y = clamp(poss[iid].pos.y, poss[iid].rad, 400.0 - poss[iid].rad);
            poss[iid].ppos.y = poss[iid].pos.y+poss[iid].vel.y*0.2; // Reset previous position
        }
    }
}