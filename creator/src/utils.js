
export async function fileToObj(file){
    const response = await fetch(file)
    if (file.endsWith('.stl')){
        const text = await response.text()
        const lines = text.split('\n')
        const vertices = []
        const normals = []
        const full = []
        const inds = []
        for (const line of lines) {
            const parts = line.trim().split(/\s+/)
            if (parts[0] === 'vertex') {
                vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]))
            } else if (parts[0] === 'facet') {
                normals.push(parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4]))
            }
        }
        for (let i = 0; i < vertices.length; i += 3) {
            full.push(vertices[i], vertices[i + 1], vertices[i + 2])
            full.push(normals[i], normals[i + 1], normals[i + 2])
            full.push(1.0, 1.0, 1.0) // color
            inds.push(i,i+1,i+2)
        }
        return {vertices, normals,full,inds}
    }
    if (file.endsWith('.obj')){
        const text = await response.text()
        const mtl = await fetch(file.replace('.obj', '.mtl'))
        const mtltext = await mtl.text()
        const color = mtltext.split('\n').find(line => line.startsWith('Kd')).split(' ').slice(1).map(Number)
        const lines = text.split('\n')
        console.log(color)
        const vertices = []
        const normals = []
        const inds = []
        const full = []
        for (const line of lines) {
            const parts = line.trim().split(/\s+/)
            if (parts[0] === 'v') {
                vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]))
            } else if (parts[0] === 'vn') {
                normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]))
            }
        }
        for (let i = 0; i < vertices.length; i += 3) {
            full.push(vertices[i], vertices[i + 1], vertices[i + 2])
            full.push(normals[i], normals[i + 1], normals[i + 2])
            full.push(color[0], color[1], color[2]) // color
            inds.push(i,i+1,i+2)
        }
        return {vertices, normals,full,inds}
    }
}