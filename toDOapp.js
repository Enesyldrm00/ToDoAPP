const input = document.getElementById("gorevinput");
const ekleBtn = document.getElementById("ekleBtn");
const liste = document.getElementById("gorevlistesi");
const kategoriSecim = document.getElementById("kategoriSec");

const API_URL = 'http://localhost:3000';

async function yukle() {
    liste.innerHTML = ""; 
    try {
        const response = await fetch(`${API_URL}/tasks`);
        const kayitli = await response.json();
        kayitli.forEach(task => {
            arayuzeEkle(task.title, task.id, task.category_name); 
        });
    } catch (err) {
        console.error('Yukleme hatasi:', err);
    }
}

async function ekle() {
    const newtask = input.value.trim();
    const kategoriId = parseInt(kategoriSecim.value);

    if (newtask === "") {
        alert('Gorev bos olamaz');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: newtask, 
                user_id: 1, 
                category_id: kategoriId 
            })
        });
        
        const data = await response.json();
        console.log('Eklendi:', data);
        
        input.value = "";
        yukle();
    } catch (err) {
        console.error('Ekleme hatasi:', err);
        alert('Hata: ' + err.message);
    }
}

function arayuzeEkle(metin, id, kategoriAdi) {
    const li = document.createElement("li");
    const katEtiketi = kategoriAdi || 'Genel';
    
    li.innerHTML = `<span>${metin}</span> <small class="kat-etiket">${katEtiketi}</small>`;

    const silBtn = document.createElement("button");
    silBtn.textContent = "SIL";
    silBtn.classList.add("sil-btn");

    silBtn.addEventListener("click", async () => {
        try {
            await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
            li.remove();
        } catch (err) {
            console.error('Silme hatasi:', err);
        }
    });

    li.appendChild(silBtn);
    liste.appendChild(li);
}

ekleBtn.addEventListener("click", ekle);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") ekle();
});

yukle();