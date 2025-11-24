
//burada getElementById ile htmldeki idleri çekip kullınma sunuyoz js de.
const input = document.getElementById("gorevinput");
const ekleBtn = document.getElementById("ekleBtn");
const liste = document.getElementById("gorevlistesi");


//burada boş bir liste oluşturduk ,querySelectorAll tüm li leri seçti,push metodu ile textcontent(yazdırıyo) diziye ekliyo,kalan şeylerde
//local storage mini bir veri tabanı ,JSON.stringify(gorevler) ile diziyi string hale getirip depolar sayfa yenilense bile dizi kaybolmaz

function kaydet() {
  const gorevler = [];
  liste.querySelectorAll("li").forEach(li => {
    gorevler.push(li.firstChild.textContent); // sadece görev metni
  });
  localStorage.setItem("gorevler", JSON.stringify(gorevler));
}
 //input.addEventListener  gemini bak space ekleme yapccam
 

 
function yukle() {

    const kayitli = JSON.parse(localStorage.getItem("gorevler"));
      kayitli.forEach(eleman=>{
    const li = document.createElement("li");
    li.textContent=eleman;
    const silBtn=document.createElement("button");
    silBtn.textContent="SİL";
    silBtn.classList.add("sil-btn");
    silBtn.addEventListener("click", () => {
        
    li.remove();
    kaydet();
  }); 
  li.appendChild(silBtn);
  liste.appendChild(li);
  

 
  });                                                       
     
}

  function ekle() {
  const newtask = input.value.trim();              
  if(newtask === "") return;
  
  const li = document.createElement("li");
  li.textContent = newtask;

   const silBtn=document.createElement("button");
   silBtn.textContent="SİL"
  silBtn.classList.add("sil-btn");




  silBtn.addEventListener("click", () => {
    li.remove();
    kaydet();
  });
   li.appendChild(silBtn);
  liste.appendChild(li);
  input.value = "";
  kaydet();
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
