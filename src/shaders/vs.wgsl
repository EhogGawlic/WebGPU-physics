struct vout {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
};

@vertex
fn main(
    @location(0) position: vec4<f32>,
    @location(1) color: vec4<f32>
) -> vout {
    var out: vout;
    out.position = position;
    out.color = color;
    return out;
}