// Variabel yang berisi soal-soal yang sudah diacak
const soalInduk = setSoal();

// Variabel yang menampung semua jawaban user
const jawabanUser = [];

// Semua jawaban user yang benar
const jawabanBenar = [];

// Index Halaman
let indexHalaman = 0;

// Fungsi untuk mengklik navbar
function navbarKlik(koreksi = false) { // Secara default koreksi bernilai false 

    // Ambil semua elemen list navbar
    const navbarList = document.querySelectorAll('.navbar-list li');

    // Looping elemen
    navbarList.forEach(e => {

        // Jika koreksi bernilai true
        if (koreksi) {

            // Ambil text didalam list dan jadikan angka
            const index = +e.textContent - 1;

            // Cari apakah jawaban soal yang berada di index ini benar
            const soalBenar = jawabanBenar.filter(el => el.indexSoal == index);

            // Variabel untuk menampung soal yang terjawab
            let soalTerjawab = [];

            // Looping jawaban dari user
            jawabanUser.forEach(el => {

                // Jika indexnya sama
                if (el.indexSoal == index) {

                    // Looping soal
                    soalInduk.forEach(item => {

                        // Jika soalnya sama
                        if (el.soal == item.soal) {

                            // Maka masukkan soal ke dalam variabel
                            soalTerjawab.push(el);
                        }
                    });
                };
            });

            // Jika jawaban soal benar
            if (soalBenar.length != 0) {

                // Maka tambahkan class benar ke dalam elemen list
                e.classList.add('benar');

                // Jika soal tidak dijawab
            } else if (soalTerjawab.length == 0) {

                // Maka tambahkan class tidak-terjawab ke dalam elemen list
                e.classList.add('tidak-terjawab');

                // Jika jawaban soal salah
            } else {

                // Maka tambahkan class salah ke dalam elemen list
                e.classList.add('salah');
            }
        }

        // Beri event click pada elemen list
        e.addEventListener('click', function () {

            // Reset index halaman ke text yang ada didalam elemen list
            indexHalaman = +e.textContent - 1;

            // Looping elemen list
            navbarList.forEach(el => {

                // Hapus semua class active
                el.classList.remove('active');
            });

            // Tambahkan class active ke elemen list yang sedang di klik
            this.classList.add('active');

            // Jika koreksi bernilai true
            if (koreksi) {

                // Jalankan fungsi addSoal dan ubahIndex dengan memberikan argumen nilai true
                addSoal(true);
                ubahIndex(true);

                // Jika koreksi bernilai false
            } else {

                // Maka jalankan fungsi addSoal, ubahIndex, dan pilihanKlik tanpa memberikan argumen
                addSoal();
                ubahIndex();
                pilihanKlik();
            }
        });

    });
}

// Fungsi untuk menambahkan navbar ke dalam container
function navbar() {

    // Ambil elemen ul pembungkus list
    const navbarList = document.querySelector('.navbar-list');

    // Ambil elemen navbar
    const navbar = document.querySelector('.navbar');

    // Isi variabel soal dengan jumlah semua soal
    const soal = soalInduk.length;

    // Hapus class not-active dari elemen navbar
    navbar.classList.remove('not-active');

    // Buat variabel html yang isinya adalah elemen html list dalam bentuk string
    let html = '<li class="active">1</li>';

    // Looping sebanyak jumlah soal
    for (let i = 1; i < soal; i++) {

        // Tambahkan elemen ke dalam variabel html dengan bentuk string
        html += `
            <li>${i + 1}</li>
        `;
    }

    // Ubah html elemen ul pembungkus list dengan html yang sudah dibuat
    navbarList.innerHTML = html;
}

// Fungsi untuk mengklik pilihan
function pilihanKlik() {

    // Ambil semua elemen pilihan
    const pilihanList = document.querySelectorAll('.pilihan ul li');

    // Looping elemen
    pilihanList.forEach(e => {

        // Beri event click
        e.addEventListener('click', function () {

            // Ambil elemen label dari anak pertama elemen yang sedang di klik
            const label = this.firstElementChild;

            // Ambil soal berdasarkan index halaman saat ini
            const soal = soalInduk[indexHalaman];

            // Ambil data yang dikirim melalui html
            const pilihanUser = +label.getAttribute('data-value');

            // Jika didalam elemen label ada class active
            if (label.className.includes('active')) {

                // Maka hilangkan class active nya
                label.classList.toggle('active');

                // Looping jawaban user
                jawabanUser.forEach((el, i) => {

                    // Jika indexnya sama
                    if (el.indexSoal == indexHalaman) {

                        // Hapus jawaban usernya
                        jawabanUser.splice(i, 1);
                    }
                });

                // Jika tidak ada classnya
            } else {

                // Cari soal yang indexnya sama dengan index halaman saat ini
                const soalSebelumnya = jawabanUser.filter(e => e.indexSoal == indexHalaman);

                // Looping elemen pilihan
                pilihanList.forEach(el => {

                    // Hapus class active pada label semua list
                    el.firstElementChild.classList.remove('active');
                });

                // Tambahkan class active pada label yang ada di elemen list saat ini
                label.classList.add('active');

                // Jika soalnya ada
                if (soalSebelumnya.length != 0) {

                    // Looping jawaban user
                    jawabanUser.forEach(e => {

                        // Jika soalnya sama
                        if (e == soalSebelumnya[0]) {

                            // Ubah jawaban sebelumnya dengan jawaban saat ini
                            e.jawaban = pilihanUser;
                        };
                    });

                    // Jika soalnya tidak ada
                } else {

                    // Tambahkan item baru ke jawaban user
                    jawabanUser.push({

                        // Index soal berisi index halaman saat ini
                        indexSoal: indexHalaman,

                        // Soal berisi soal saat ini
                        soal: soal.soal,

                        // Jawaban berisi jawaban saat ini
                        jawaban: pilihanUser
                    });
                };
            };
        });
    });
};

// Fungsi untuk mengklik tombol
function tombolKlik(koreksi = false) { // Parameter koreksi berisi nilai default false 

    // Ambil elemen tombol sebelumnya
    const prevBtn = document.querySelector('button.prev')

    // Ambil elemen tombol selanjutnya
    const nextBtn = document.querySelector('button.next');

    // Ambil elemen tombol submit
    const submitBtn = document.querySelector('button.submit');

    // Ambol elemen footer
    const footer = document.querySelector('.footer');

    // Jika koreksi bernilai true maka jalankan fungsi ubahIndex dengan mengirimkan parameter true, jika bernilai false maka jalankan fungsi ubahIndex tanpa mengirimkan parameter
    (koreksi) ? ubahIndex(true): ubahIndex();

    // Hapus class not-active dari elemen footer
    footer.classList.remove('not-active');

    // Beri event saat keyboard di klik
    document.body.onkeyup = function (e) {
        // Nama key dari keyboard
        // Key 1 : ArrowRight
        // Key 2 : ArrowLeft

        // Jika key dari keyboard yang ditekan sama dengan ArrowRight
        if (e.key == 'ArrowRight') {

            // Jika index halaman tidak berada di paling akhir
            if (indexHalaman != soalInduk.length - 1) {

                // Tambahkan 1 kedalam index halaman
                indexHalaman++;

                // Jika koreksi bernilai true
                if (koreksi) {

                    // Jalankan fungsi addSoal dan ubahIndex dengan mengirimkan argumen nilai true
                    addSoal(true);
                    ubahIndex(true);

                    // Jika bernilai false
                } else {

                    // Jalankan fungsi addSoal, ubahIndex, dan pilihanKlik tanpa memberikan argumen
                    addSoal();

                    ubahIndex();
                    pilihanKlik();
                }
            }

            // JIka key dari keyboard yang ditekan sama dengan ArrowLeft
        } else if (e.key == 'ArrowLeft') {

            // Jika index halaman bukan yang paling awal
            if (indexHalaman != 0) {

                // Kurangi 1 index halaman
                indexHalaman--;

                // Jika koreksi bernilai true
                if (koreksi) {

                    // Jalankan fungsi addSoal dan ubahIndex dengan mengirimkan argumen nilai true
                    addSoal(true);
                    ubahIndex(true);

                    // Jika koreksi bernilai false
                } else {

                    // Jalankan fungsi addSoal, ubahIndex, dan pilihanKlik tanpa memberikan argumen
                    addSoal();

                    ubahIndex();
                    pilihanKlik();
                }
            }
        }
    }

    // Fungsi saat tombol next diklik
    function next() {

        // Jika halaman bukan yang paling akhir
        if (indexHalaman != soalInduk.length - 1) {

            // Tambahkan 1 index halaman
            indexHalaman++;

            // Jika koreksi bernilai true
            if (koreksi) {

                // Jalankan fungsi addSoal dan ubahIndex dengan mengirimkan argumen nilai true
                addSoal(true);
                ubahIndex(true);

                // Jika koreksi bernilai false
            } else {

                // Jalankan fungsi addSoal, ubahIndex, dan pilihanKlik tanpa memberikan argumen
                addSoal();

                ubahIndex();
                pilihanKlik();
            }
        }
    };

    // Fungsi saat tombol prev di klik
    function prev() {

        // Jika halaman bukan yang paling awal
        if (indexHalaman != 0) {

            // Kurangi 1 index halaman
            indexHalaman--;

            // Jika koreksi bernilai true
            if (koreksi) {

                // Jalankan fungsi addSoal dan ubahIndex dengan memberikan argumen nilai true
                addSoal(true);
                ubahIndex(true);

                // Jika koreksi bernilai false
            } else {

                // Jalankan fungsi addSoal, ubahIndex, dan pilihanKlik tanpa memberikan argumen
                addSoal();

                ubahIndex();
                pilihanKlik();
            }
        }
    }

    // Beri event klik pada tombol next
    nextBtn.addEventListener('click', next);

    // Beri event klik pada tombol prev
    prevBtn.addEventListener('click', prev);

    // Beri event klik pada tombol submit
    submitBtn.addEventListener('click', function () {

        // Jika user yakin ingin mengakhiri kuis
        if (confirm('Yakin ingin mengakhiri kuis?')) {

            // Jalankan fungsi submitKlik
            submitKlik();

            // Hapus event klik pada tombol next dan prev
            nextBtn.removeEventListener('click', next);
            prevBtn.removeEventListener('click', prev);
        };
    });
};

// Fungsi saat tombol submit di klik
function submitKlik() {

    // Ambil elemen container
    const container = document.querySelector('.container');

    // Ambil elemen  navbar
    const navbar = document.querySelector('.navbar');

    // Ambil elemen footer
    const footer = document.querySelector('.footer');

    // Tambahkan class not-active pada navbar dan footer
    navbar.classList.add('not-active');
    footer.classList.add('not-active');

    // Looping jawaban user 
    jawabanUser.forEach(e => {

        // Ambil soal berdasarkan index soal pada jawaban user
        const soal = soalInduk[e.indexSoal];

        // Jika jawaban user sama dengan jawaban soal
        if (e.jawaban == soal.jawaban) {

            // Tambahkan jawaban ke jawaban benar 
            jawabanBenar.push(e);
        }
    });

    // Tentukan nilai dari hasil 100 bagi jumlah soal lalu dikali jumlah jawaban benar
    const nilai = Math.round(((100 / soalInduk.length) * jawabanBenar.length));

    // Buat elemen html dalam bentuk string
    let html = `
    <div class="jumlah-nilai">
        <div class="nilai ${(nilai >= 60) ? 'lulus' : 'gagal'}">${nilai}</div>
        <div class="jumlah-soal">
            <span class="soal-terjawab">Terjawab : ${jawabanUser.length} Soal</span>
            <span class="soal-benar">Benar : ${jawabanBenar.length} Soal</span>
            <span class="soal-salah">Salah : ${jawabanUser.length - jawabanBenar.length} Soal</span>
        </div>
        <button class="btn btn-info">Lihat Kesalahan</button>
    </div>
    `;

    // Ubah html pada container dengan html yang sudah dibuat
    container.innerHTML = html;

    // Tambahkan class koreksi ke container
    container.classList.add('koreksi');

    // Ambil elemen tombol lihat kesalahan
    const lihatKesalahan = document.querySelector('.jumlah-nilai button');

    // Beri event klik pada tombol lihat kesalahan
    lihatKesalahan.addEventListener('click', function () {

        // Hapus class koreksi pada container
        container.classList.remove('koreksi');

        // Jalankan fungsi load dengan mengirimkan argumen nilai true
        load(true);
    });
}

// Fungsi saat index halaman berubah
function ubahIndex(koreksi = false) { // Memiliki parameter koreksi yang defaultnya bernilai false

    // Ambil elemen tombol prev
    const prevBtn = document.querySelector('button.prev');

    // Ambil elemen tombol next
    const nextBtn = document.querySelector('button.next');

    // Ambil elemen tombol submit
    const submitBtn = document.querySelector('button.submit');

    // Ambil elemen list navbar
    const navbarList = document.querySelectorAll('.navbar-list li');

    // Looping elemen list
    navbarList.forEach(e => {

        // Jika koreksi bernilai true
        if (koreksi) {

            // Hapus class terjawab pada elemen list
            e.classList.remove('terjawab');

            // Jika koreksi bernilai false
        } else {

            // Looping jawaban user
            jawabanUser.forEach(el => {

                // Jika index soalnya sama dengan text dari elemen list ini
                if (el.indexSoal == +e.textContent - 1) {

                    // Tambahkan class terjawab ke elemen list ini
                    e.classList.add('terjawab');
                }
            });
        }

        // Jika text dari elemen list ini sama dengan index halaman
        if (e.textContent == indexHalaman + 1) {

            // Looping elemen navbar list
            navbarList.forEach(el => {

                // Hapus class active pada semua elemen list
                el.classList.remove('active');
            });

            // Hapus class terjawab dari elemen list saat ini
            e.classList.remove('terjawab');

            // Tambahkan class active pada elemen list saat ini
            e.classList.add('active');
        }
    });

    // Jika halaman adalah yang paling awal
    if (indexHalaman == 0) {

        // Hapus class not-active dan ganti class btn-secondary menjadi btn-primary pada tombol next
        nextBtn.classList.remove('not-active');
        nextBtn.classList.replace('btn-secondary', 'btn-primary');

        // Ganti class btn-primary dengan btn-secondary pada tombol prev
        prevBtn.classList.replace('btn-primary', 'btn-secondary');

        // Hapus class active pada tombol submit
        submitBtn.classList.remove('active');

        // Jika halaman adalah yang paling akhir
    } else if (indexHalaman == soalInduk.length - 1) {

        // Ganti class btn-secondary dengan btn-primary
        prevBtn.classList.replace('btn-secondary', 'btn-primary');

        // Jika koreksi bernilai true
        if (koreksi) {

            // Hapus class not-active dan ganti class btn-primary dengan btn-secondary pada tombol next
            nextBtn.classList.remove('not-active');
            nextBtn.classList.replace('btn-primary', 'btn-secondary');

            // Hapus class active pada tombol submit
            submitBtn.classList.remove('active');

            // Jika koreksi bernilai false
        } else {

            // Tambahkan class not-active pada tombol next
            nextBtn.classList.add('not-active');

            // Hapus class active pada tombol submit
            submitBtn.classList.add('active');
        }

        // Jika halaman bukan merupakan yang paling akhir dan bukan yang paling awal
    } else if (indexHalaman > 0 && indexHalaman < soalInduk.length - 1) {

        // Hapus class active pada tombol submit
        submitBtn.classList.remove('active');

        // Ganti class btn-secondary dengan btn-primary pada tombol prev
        prevBtn.classList.replace('btn-secondary', 'btn-primary');

        // Ganti class btn-secondary dengan btn-primary dan hapus class not-active pada tombol next
        nextBtn.classList.replace('btn-secondary', 'btn-primary');
        nextBtn.classList.remove('not-active');
    }
}

// Fungsi untuk mengacak urutan array
function shuffle(array) { // Memiliki parameter array
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    // Kembalikan array yang sudah diacak
    return array;
}

// Fungsi untuk membuat soal
function setSoal() {

    // Variabel soal yang berisi soal-saol yang dibuat manual, berbentuk array yang didalamnya berisi object
    const soal = [
        // {
        //     type: 'text', // Properti type untuk tipe dari soal tersebut
        //     type: 'text/image', // Jika tipenya text/image berarti soalnya mengandung gambar

        //     img: 'soal2-img3.jpg', // Properti img untuk menyimpan nama gambar yang akan ditampilkan

        //     // Properti soal yang berisi soal dalam bentuk text
        //     soal: 'Mamalia terbesar sepanjang sejarah adalah..',

        //     // Properti pilihan untuk pilihan jawaban
        //     pilihan: ['Paus Biru', 'Hiu Putih', 'Gajah', 'Kuda Nil'],

        //     // Pilihan jawaban dapat berupa gambar
        //     pilihan: ['soal2-img1.jpg', 'soal2-img2.jpg', 'soal2-img3.jpg', 'soal2-img4.jpg'],

        //     // Jawaban yang benar berisi index dari pilihan
        //     jawaban: 0
        // }
        {
            type: 'text',
            soal: 'Kenapa pesawat ulang alik dan kapsul luar angkasa tidak terbakar saat melewati atmosfer?',
            pilihan: ['Karena dilapisi heat shield (perisai panas) dan mengambil sudut 40 derajat', 'Karena badan pesawat terbuat dari baja dan besi', 'Karena badan pesawat dilapisi oleh tabir surya', 'Karena atmosfer itu tidak panas'],
            jawaban: 0
        },
        {
            type: 'text',
            soal: 'Bangunan yang terkenal dari India adalah..',
            pilihan: ['soal4-img1.jpg', 'soal4-img2.jpg', 'soal4-img3.jpg', 'soal4-img4.jpg'],
            jawaban: 3
        },
        {
            type: 'text/image',
            img: 'soal4-img3.jpg',
            soal: 'Patung tersebut terletak di..',
            pilihan: ['Rio de Janeiro, Brasil', 'Paris, Prancis', 'Agra, India', 'Huairou District, Tiongkok'],
            jawaban: 0
        },
        {
            type: 'text',
            soal: 'Bangunan terkenal yang berasal dari Prancis adalah..',
            pilihan: ['soal4-img4.jpg', 'soal4-img1.jpg', 'soal4-img2.jpg', 'soal4-img3.jpg'],
            jawaban: 1
        },
        {
            type: 'text/image',
            img: 'soal4-img2.jpg',
            soal: 'Bangunan diatas terletak di negara..',
            pilihan: ['Taiwan', 'Hongkong', 'Tiongkok', 'Singapura'],
            jawaban: 2
        },
        {
            type: 'text',
            soal: 'Sebuah kondisi dimana kamu merasa familiar dengan peristiwa yang dialami seakan-akan hal tersebut sudah pernah terjadi sebelumnya dinamakan..',
            pilihan: ['Insomnia', 'Amnesia', 'Diabetes', 'Deja vu'],
            jawaban: 3
        },
        {
            type: 'text',
            soal: 'Paradox yang menjelaskan bahwa hal kecil dimasa lalu dapat berpengaruh besar di masa depan bernama..',
            pilihan: ['Butterfly Effect Paradox', 'GrandFather Paradox', 'Bootstrap Paradox', 'Predestination Paradox'],
            jawaban: 0
        },
        {
            type: 'text',
            soal: 'Antimateri adalah..',
            pilihan: ['Materi yang sedang makar', 'Materi yang tersusun dari antipartikel partikel yang sesuai dari materi biasa', 'Materi pelajaran', 'Virus'],
            jawaban: 1
        },
        {
            type: 'text',
            soal: 'Syarat api dapat tercipta atau yang disebut segitiga api diantaranya..',
            pilihan: ['Makanan, minuman, Smartphone', 'Buku, Pensil, Kertas', 'Bahan bakar, sumber panas, oksigen', 'Reaksi fusi dan fisi'],
            jawaban: 2
        },
        {
            type: 'text/image',
            img: 'soal10-img1.jpg',
            soal: 'Nama tokoh penemu pada gambar diatas adalah..',
            pilihan: ['Albert Einstein', 'Galileo Galilei', 'Benjamin Franklin', 'Sir Isaac Newton'],
            jawaban: 3
        }
    ];

    // Jalankan fungsi acak soal lalu kembalika array yang sudah diacak
    return shuffle(soal);
}

// Fungsi untuk menambahkan soal ke halaman
function addSoal(koreksi = false) { // Berisi parameter koreksi yang nilai defaultnya false

    // Arahkan scroll ke paling atas
    scrollTo(0, 0);

    // Variabel html yang berisi elemen html dalam bentuk string
    let html = '';

    // Variabel soal yang berisi soal berdasarkan index halaman
    const soal = soalInduk[indexHalaman];

    // Ambil elemen container
    const container = document.querySelector('main .container');

    // Tambahkan tag pembuka
    html += `
    <div class="soal">`

    // Jika soalnya mengandung gambar
    if (soal.type == 'text/image') {

        // Tambahkan tag image ke dalam html yang source nya diambil dari nama image yang sudah dibuat
        // Tambahkan soalnya di bawah image nya
        html += `
        <div class="img">
            <img src="img/${soal.img}">
        </div>
        ${soal.soal}
        `;

        // Jika tidak mengandung gambar
    } else {

        // Tambahkan soal langsung ke dalam elemen
        html += `
        ${soal.soal}
        `;
    }

    // Tutup tag soal dan tambahkan tag pembuka untuk pilihan jawaban
    html += `</div>
    <div class="pilihan">
        <ul>`

    // Jalankan fungsi addPilihan dengan argumen pilihan jawaban dari soal saat ini
    html += addPilihan(soal.pilihan);

    // Tutup tag pilihan jawaban
    html += `</ul>
    </div>
    `;

    // Ubah html pada container dengan html yang sudah dibuat
    container.innerHTML = html;

    // Looping jawaban user
    jawabanUser.forEach(e => {

        // Jika index soalnya sama dengan index halaman saat ini
        if (e.indexSoal == indexHalaman) {

            // Ambil elemen label yang nilai attribut data-value nya sama dengan pilihan jawaban dari user
            const label = document.querySelector(`.label[data-value="${e.jawaban}"]`);

            // Tambahkan class active pada label tersebut
            label.classList.add('active');
        }
    });

    // Jika koreksi bernilai true
    if (koreksi) {

        // Buat variabel untuk menampung soal-soal yang sudah terjawab
        let soalTerjawab = [];

        // Looping jawaban user
        jawabanUser.forEach(e => {

            // Ambil elemen label yang nilai attribut data-value nya sama dengan pilihan jawaban dari user
            const label = document.querySelector(`.label[data-value="${e.jawaban}"]`);

            // Ambil elemen label yang attribut data-value nya sama dengan jawaban dari soal saat ini lalu masukkan ke variabel labelSuccess
            const labelSuccess = document.querySelector(`.label[data-value="${soal.jawaban}"]`);

            // Jika index soal nya sama dengan index halaman saat ini
            if (e.indexSoal == indexHalaman) {

                // Looping soal
                soalInduk.forEach(el => {

                    // Jika soal saat ini sama dengan soal aslinya
                    if (e.soal == el.soal) {

                        // Tambahkan soal ke dalam variabel soalTerjawab
                        soalTerjawab.push(e);
                    }
                })

                // Jika jawabannya benar
                if (e.jawaban == soal.jawaban) {

                    // Tambahkan class benar ke labelnya
                    label.classList.add('benar');

                    // Jika jawabannya salah
                } else {

                    // Tambahkan class benar pada pilihan jawaban yang benar
                    labelSuccess.classList.add('benar');

                    // Tambahkan class salah ke pilihan jawaban user
                    label.classList.add('salah');
                }
            }
        });

        // Jika soal tidak terjawab
        if (soalTerjawab.length == 0) {

            // Ambil elemen label yang attribut data-value nya sama dengan jawaban soal saat ini
            const labelSuccess = document.querySelector(`.label[data-value="${soal.jawaban}"]`);

            // Tambahkan class benar ke label
            labelSuccess.classList.add('benar');
        }
    }
}

// Fungsii untuk menambahkan elemen pilihan jawaban ke halaman
function addPilihan(jawaban) { // Menerima parameter pilihan jawaban dari soal

    // Buat variabel html yang nantinya berisi elemen html dalam bentuk string
    let html = '';

    // Buat variabel label sebagai text dalam elemen label
    const label = ['A', 'B', 'C', 'D'];

    // Looping parameter pilihan jawaban
    jawaban.forEach((e, i) => {

        // Jika pilihan jawaban merupakan string
        if (typeof e == 'string') {

            // Jika pilihan jawaban mengandung text img
            if (e.includes('img')) {

                // Maka buat pilihan jawaban yang berisi image
                // Isi nilai dari attribut data-value dengan index looping
                // Isi text dari label dengan label yang sudah dibuat berdasarkan indexnya
                html += `
                <li>
                    <span class="label" data-value="${i}">${label[i]}</span>
                    <span class="jawaban">
                        <img src="img/${e}">
                    </span>
                </li>
                `;

                // Jika tidak mengandung text img
            } else {

                // Maka buat pilihan jawaban yang hanya berisi text saja
                html += `
                <li>
                    <span class="label" data-value="${i}">${label[i]}</span>
                    <span class="jawaban">${e}</span>
                </li>
                `;
            }

            // Jika pilihan jawaban bukan merupakan string
        } else {

            // Maka buat pilihan jawaban yang berisi pilihan jawaban dari soal
            html += `
            <li>
                <span class="label" data-value="${i}">${label[i]}</span>
                <span class="jawaban">${e}</span>
            </li>
            `;
        }
    });

    // Kembalikan html yang sudah dibuat
    return html;
}

// Fungsi untuk menjalankan semua fungsi saat kondisi tertentu 
function load(koreksi = false) { // Menerima parameter koreksi yang nilai defaultnya false

    // Jika koreksi bernilai true
    if (koreksi) {

        // Reset index halaman kembali ke awal
        indexHalaman = 0;

        // Jalankan fungsi addSoal, navbarKlik, dan tombolKlik dengan mengirimkan argumen nilai true
        addSoal(true);

        // Jalankan fungsi navbar tanpa memberikan argumen
        navbar();

        navbarKlik(true);
        tombolKlik(true);

        // Jika koreksi bernilai false
    } else {

        // Jalankan fungsi addSoal, navbar, navbarKlik, pilihanKlik, dan tombolKlik tanpa mengirimkan argumen
        addSoal();
        navbar();

        navbarKlik();
        pilihanKlik();
        tombolKlik();
    }
}