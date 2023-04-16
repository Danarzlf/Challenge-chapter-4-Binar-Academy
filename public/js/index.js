async function addCar() {
    // e.prevent.default()
    const data = {
        name: document.getElementById("name").value
    }

    const responseApi = await fetch.post('/api/cars', data);
    if(responseApi.data.status === 'success') {
        alert("berhasil tambah data baru")
    }
}


