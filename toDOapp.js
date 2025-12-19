
//burada getElementById ile htmldeki idleri çekip kullınma sunuyoz js de.
const input = document.getElementById("gorevinput");
const ekleBtn = document.getElementById("ekleBtn");
const liste = document.getElementById("gorevlistesi");


//burada boş bir liste oluşturduk ,querySelectorAll tüm li leri seçti,push metodu ile textcontent(yazdırıyo) diziye ekliyo,kalan şeylerde


function kaydet() {
  const gorevler = [];
  liste.querySelectorAll("li").forEach(li => {
    gorevler.push(li.firstChild.textContent); // sadece görev metni
  });
  localStorage.setItem("gorevler", JSON.stringify(gorevler));
}

 

 
async function yukle(kategoriIsmi = "") {
    liste.innerHTML = ""; 
    let url = 'http://localhost:3000/tasks';
    if (kategoriIsmi) url += `?category=${kategoriIsmi}`;

    const response = await fetch(url);
    const kayitli = await response.json();

    kayitli.forEach(eleman => {
        
        arayuzeEkle(eleman.title, eleman.id, eleman.category_name); 
    });
}                             
     

async function ekle() {
    const newtask = input.value.trim();
    // HTML'deki <select id="kategoriSec"> elemanından ID'yi alıyoruz
    const kategoriId = document.getElementById("kategoriSec").value; 

    if (newtask === "") return;

    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title: newtask, 
            user_id: 1,           // SQL'deki mevcut user ID'n (pgAdmin'den bakabilirsin)
            category_id: kategoriId 
        })
    });
    
    const veri = await response.json();
    
  
    const kategoriAdi = document.getElementById("kategoriSec").options[document.getElementById("kategoriSec").selectedIndex].text;
    
 
    arayuzeEkle(veri.title, veri.id, kategoriAdi); 
    input.value = "";
}
function arayuzeEkle(metin, id, kategoriAdi) {
    const li = document.createElement("li");
    
   
    li.innerHTML = `<span>${metin}</span> <small class="kat-etiket">${kategoriAdi || ''}</small>`;

    const silBtn = document.createElement("button");
    silBtn.textContent = "SİL";
    silBtn.classList.add("sil-btn");

    silBtn.addEventListener("click", async () => {
        // SQL'den o ID'li satırı siliyoruz
        await fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' });
        li.remove();
    });

    li.appendChild(silBtn);
    liste.appendChild(li);
}
// Butona tıklayınca ekle() çalışsın
ekleBtn.addEventListener("click", ekle);
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ekle();
    }
});
yukle();
    

// getElementById	,HTML elemanlarını JS’e bağlar
// addEventListener,	Olay (event) tetiklendiğinde kod çalıştırır
// reateElement,	Yeni HTML elemanı oluşturur
// appendChild,	Elemanı DOM’a ekler
// //remove(),	Elemanı siler
// localStorage.setItem	,Veriyi tarayıcıya kaydeder
// localStorage.getItem	,Kaydedilmiş veriyi alır
// JSON.stringify / parse,	Dizi ↔️ Metin dönüşümünü yapar
// trim()	,Yazıdaki boşlukları siler
