@group(0) @binding(0) var<storage, read_write> poss: array<Ball>;

struct Ball {
    pos: vec2<f32>, // Position of the ball
    vel: vec2<f32>, // Velocity of the ball
    rad: f32,       // Radius of the ball
    mass: f32       // Mass of the ball
}

@compute @workgroup_size(1) fn main(
        @builtin(global_invocation_id) id: vec3u
) {
    let iid = id.x; // Index of the current ball
    let tpos: vec2<f32> = poss[iid].pos; // Current ball's position
    let tvel: vec2<f32> = poss[iid].vel; // Current ball's velocity

    // Update position based on velocity
    poss[iid].pos += tvel;
    poss[iid].vel += vec2<f32>(0.0, 9.81) * 0.016; // Gravity effect
    poss[iid].vel *= 0.99;
    // Check for collisions with all other balls
    for (var i: u32 = 0u; i < arrayLength(&poss); i = i + 1u) {
        if (i == iid) {
            continue; // Skip self
        }

        let pos: vec2<f32> = poss[i].pos; // Position of the other ball
        let dist: f32 = length(pos - tpos); // Distance between the two balls
        let sd: f32 = poss[i].rad + poss[iid].rad; // Sum of the radii (collision threshold)

        if (dist < sd) { // Collision detected
            let cn: vec2<f32> = normalize(pos - tpos + vec2<f32>(0.0001)); // Collision normal
            let overlap: f32 = sd - dist; // Overlap distance

            // Resolve collision by moving both balls apart
            poss[iid].pos -= cn * (overlap * 0.5); // Move current ball away
            poss[i].pos += cn * (overlap * 0.5);   // Move other ball away

            // Calculate relative velocity
            let relVel: vec2<f32> = poss[i].vel - poss[iid].vel; // Relative velocity
            let velAlongNormal: f32 = dot(relVel, cn); // Velocity along the collision normal

            // Skip if balls are moving apart
            if (velAlongNormal > 0.0) {
                continue;
            }

            // Calculate impulse
            let e: f32 = 1.0; // Coefficient of restitution (1.0 for perfectly elastic collisions)
            let j: f32 = -(1.0 + e) * velAlongNormal / (1.0 / poss[i].mass + 1.0 / poss[iid].mass);

            // Apply impulse
            let impulse: vec2<f32> = j * cn;
            poss[iid].vel -= impulse / poss[iid].mass; // Apply impulse to current ball
            poss[i].vel += impulse / poss[i].mass;    // Apply impulse to other ball
        }
    }
    if (poss[iid].pos.x-poss[iid].rad < 0.0 || poss[iid].pos.x+poss[iid].rad > 600.0) {
        poss[iid].pos.x = clamp(poss[iid].pos.x, poss[iid].rad, 600.0 - poss[iid].rad); // Clamp position
        poss[iid].vel.x = -poss[iid].vel.x*0.2; // Bounce
    }
    if (poss[iid].pos.y-poss[iid].rad < 0.0 || poss[iid].pos.y+poss[iid].rad > 400.0) {
        poss[iid].pos.y = clamp(poss[iid].pos.y, poss[iid].rad, 400.0 - poss[iid].rad); // Clamp position
        poss[iid].vel.y = -poss[iid].vel.y*0.2; // Bounce
    }
}