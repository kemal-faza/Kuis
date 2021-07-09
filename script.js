const soalInduk = setSoal();
const jawabanUser = [];
const jawabanBenar = [];
let index = 0;

function navbarKlik(koreksi = false) {
    const navbarList = document.querySelectorAll('.navbar-list li');

    navbarList.forEach(e => {

        if (koreksi) {
            const indexHalaman = +e.textContent;
            const soalBenar = jawabanBenar.filter(el => el.indexSoal == indexHalaman - 1);
            let soalTerjawab = [];

            jawabanUser.forEach(el => {
                if (el.indexSoal == indexHalaman - 1) {
                    soalInduk.forEach(item => {
                        if (el.soal == item.soal) {
                            soalTerjawab.push(el);
                        }
                    });
                };
            });

            if (soalBenar.length != 0) {
                e.classList.add('benar');
            } else if (soalTerjawab.length == 0) {
                e.classList.add('tidak-terjawab');
            } else {
                e.classList.add('salah');
            }
        }
        e.addEventListener('click', function () {
            index = +e.textContent - 1;
            navbarList.forEach(el => {
                el.classList.remove('active');
            });

            this.classList.add('active');

            if (koreksi) {
                addSoal(true);
                ubahIndex(true);
            } else {
                addSoal();
                ubahIndex();
                pilihanKlik();
            }
        });

    });
}

function navbar() {
    const navbarList = document.querySelector('.navbar-list');
    const navbar = document.querySelector('.navbar');
    const soal = soalInduk.length;

    navbar.classList.remove('not-active');

    let html = '<li class="active">1</li>';
    for (let i = 1; i < soal; i++) {
        html += `
            <li>${i + 1}</li>
        `;
    }

    navbarList.innerHTML = html;
}

function pilihanKlik() {
    const pilihanList = document.querySelectorAll('.pilihan ul li');

    pilihanList.forEach(e => {
        e.addEventListener('click', function () {
            const label = this.firstElementChild;
            const soal = soalInduk[index];
            const pilihanUser = +label.getAttribute('data-value');

            if (label.className.includes('active')) {
                label.classList.toggle('active');
                jawabanUser.forEach((el, i) => {
                    if (el.indexSoal == index) {
                        jawabanUser.splice(i, 1);
                    }
                });
            } else {
                const soalSebelumnya = jawabanUser.filter(e => e.indexSoal == index);
                pilihanList.forEach(el => {
                    el.firstElementChild.classList.remove('active');
                });

                label.classList.add('active');

                if (soalSebelumnya.length != 0) {
                    jawabanUser.forEach(e => {
                        if (e == soalSebelumnya[0]) {
                            e.jawaban = pilihanUser;
                        }
                    })
                } else {
                    jawabanUser.push({
                        indexSoal: index,
                        soal: soal.soal,
                        jawaban: pilihanUser
                    });
                }
            }
        })
    });
};


function tombolKlik(koreksi = false, submit = false) {
    const prevBtn = document.querySelector('button.prev')
    const nextBtn = document.querySelector('button.next');
    const submitBtn = document.querySelector('button.submit');
    const footer = document.querySelector('.footer');

    (koreksi) ? ubahIndex(true): ubahIndex();

    footer.classList.remove('not-active');

    document.body.onkeyup = function (e) {
        // Key 1 : ArrowRight
        // Key 2 : ArrowLeft
        if (e.key == 'ArrowRight') {
            if (index != soalInduk.length - 1) {
                index++;

                if (koreksi) {
                    addSoal(true);
                    ubahIndex(true);
                } else {
                    addSoal();

                    ubahIndex();
                    pilihanKlik();
                }
            }
        } else if (e.key == 'ArrowLeft') {
            if (index != 0) {
                index--;

                if (koreksi) {
                    addSoal(true);
                    ubahIndex(true);
                } else {
                    addSoal();

                    ubahIndex();
                    pilihanKlik();
                }
            }
        }
    }

    nextBtn.addEventListener('click', function () {
        if (index != soalInduk.length - 1) {
            index++;

            if (koreksi) {
                addSoal(true);
                ubahIndex(true);
            } else {
                addSoal();

                ubahIndex();
                pilihanKlik();
            }
        }
    });

    prevBtn.addEventListener('click', function () {
        if (index != 0) {
            index--;

            if (koreksi) {
                addSoal(true);
                ubahIndex(true);
            } else {
                addSoal();

                ubahIndex();
                pilihanKlik();
            }
        }
    });

    submitBtn.addEventListener('click', function () {
        if (confirm('Yakin ingin mengakhiri kuis?')) {
            submitKlik();
        };
    });
};

function submitKlik() {
    const container = document.querySelector('.container');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');

    navbar.classList.add('not-active');
    footer.classList.add('not-active');

    jawabanUser.forEach(e => {
        const soal = soalInduk[e.indexSoal];
        if (e.jawaban == soal.jawaban) {
            jawabanBenar.push(e);
        }
    });

    const nilai = ((100 / soalInduk.length) * jawabanBenar.length);

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

    container.innerHTML = html;
    container.classList.add('koreksi');

    const lihatKesalahan = document.querySelector('.jumlah-nilai button');

    lihatKesalahan.addEventListener('click', function () {
        container.classList.remove('koreksi');
        load(true);
    });
}

function ubahIndex(koreksi = false) {
    const prevBtn = document.querySelector('button.prev');
    const nextBtn = document.querySelector('button.next');
    const submitBtn = document.querySelector('button.submit');
    const navbarList = document.querySelectorAll('.navbar-list li');

    navbarList.forEach(e => {
        if (koreksi) {
            e.classList.remove('terjawab');
        } else {
            jawabanUser.forEach(el => {
                if (el.indexSoal == +e.textContent - 1) {
                    e.classList.add('terjawab');
                }
            });
        }


        if (e.textContent == index + 1) {
            navbarList.forEach(el => {
                el.classList.remove('active');
            });


            e.classList.remove('terjawab');
            e.classList.add('active');
        }
    })

    if (index == 0) {
        nextBtn.classList.remove('not-active');

        prevBtn.classList.replace('btn-primary', 'btn-secondary');

        submitBtn.classList.remove('active');
    } else if (index == soalInduk.length - 1) {
        prevBtn.className.replace('btn-secondary', 'btn-primary');

        if (koreksi) {
            nextBtn.classList.remove('not-active');
            nextBtn.classList.replace('btn-primary', 'btn-secondary');

            submitBtn.classList.remove('active');
        } else {
            nextBtn.classList.add('not-active');
            submitBtn.classList.add('active');
        }
    } else if (index > 0 && index < soalInduk.length - 1) {
        submitBtn.classList.remove('active');

        prevBtn.classList.replace('btn-secondary', 'btn-primary');

        nextBtn.classList.replace('btn-secondary', 'btn-primary');
        nextBtn.classList.remove('not-active');
    }
}

function shuffle(array) {
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

    return array;
}


function setSoal() {
    const soal = [
        //{
        //     type: 'text',
        //     soal: 'Apa itu komputer?',
        //     pilihan: ['soal1-img1.png', 'Alat dapur', 'Perabotan rumah tangga', 'Makanan'],
        //     jawaban: 0
        // },, {
        //     type: 'text/image',
        //     img: 'soal1-img1.png',
        //     soal: 'Jenis website apakah itu?',
        //     pilihan: ['Landing Page', 'E-commerce', 'Social Media', 'Game'],
        //     jawaban: 0
        // }
        {
            type: 'text',
            soal: 'Mamalia terbesar sepanjang sejarah adalah..',
            pilihan: ['Paus Biru', 'Hiu Putih', 'Gajah', 'Kuda Nil'],
            jawaban: 0
        },
        {
            type: 'text',
            soal: 'Berikut ini yang merupakan paus biru adalah..',
            pilihan: ['soal2-img1.jpg', 'soal2-img2.jpg', 'soal2-img3.jpg', 'soal2-img4.jpg'],
            jawaban: 1
        },
        {
            type: 'text/image',
            img: 'soal2-img3.jpg',
            soal: 'Nama hewan pada gambar diatas adalah..',
            pilihan: ['Paus Orca', 'Paus Biru', 'Hiu Paus', 'Hiu putih'],
            jawaban: 2
        },
        {
            type: 'text',
            soal: 'Mengapa udara itu tidak terlihat?',
            pilihan: ['Karena udara tersusun dari partikel yang banyak dan jaraknya berdekatan', 'Karena bumi datar', 'Karena lo wibu', 'Karena udara tersusun dari partikel yang sangat sedikit dan jaraknya berjauhan'],
            jawaban: 3
        },
        {
            type: 'text',
            soal: 'Api yang paling panas berwarna..',
            pilihan: ['Hitam', 'Putih', 'Biru', 'Merah'],
            jawaban: 0
        },
        {
            type: 'text/image',
            img: 'soal6-img1.jpg',
            soal: 'Nama planet pada gambar diatas adalah..',
            pilihan: ['Jupiter', 'Saturnus', 'Uranus', 'Neptunus'],
            jawaban: 1
        },
        {
            type: 'text',
            soal: 'Yang merupakan teleskop James Webb adalah..',
            pilihan: ['soal7-img1.jpg', 'soal7-img2.jpg', 'soal7-img3.jpg', 'soal7-img4.jpg'],
            jawaban: 2
        },
        {
            type: 'text/image',
            img: 'soal8-img1.jpg',
            soal: 'Fenomena diatas bernama..',
            pilihan: ['Lidah Api Matahari', 'Hujan Meteor', 'Gerhana Bulan', 'Aurora'],
            jawaban: 3
        },
        {
            type: 'text',
            soal: 'Bintang terbesar yang pernah ditemukan oleh manusia bernama..',
            pilihan: ['Stephenson 2-18', 'UY Scuti', 'Matahari', 'VY Canis Majoris'],
            jawaban: 0
        },
        {
            type: 'text/image',
            img: 'soal7-img2.jpg',
            soal: 'Benda yang terdapat pada gambar tersebut adalah..',
            pilihan: ['Roket', 'Stasiun Luar Angkasa Internasional', 'Satelit Kominikasi', 'Meteor'],
            jawaban: 1
        }
    ];

    return shuffle(soal);
}

function addSoal(koreksi = false) {
    scrollTo(0, 0);

    let html = '';
    const soal = soalInduk[index];
    const container = document.querySelector('main .container');

    html += `
    <div class="soal">`

    if (soal.type == 'text/image') {
        html += `
        <div class="img">
            <img src="img/${soal.img}">
        </div>
        ${soal.soal}
        `;
    } else {
        html += `
        ${soal.soal}
        `;
    }

    html += `</div>
    <div class="pilihan">
        <ul>`

    html += addPilihan(soal.pilihan);

    html += `</ul>
    </div>
    `;

    container.innerHTML = html;

    jawabanUser.forEach(e => {
        if (e.indexSoal == index) {
            const label = document.querySelector(`.label[data-value="${e.jawaban}"]`);
            label.classList.add('active');
        }
    });

    if (koreksi) {
        const soalTerjawab = [];
        jawabanUser.forEach(e => {
            const label = document.querySelector(`.label[data-value="${e.jawaban}"]`);
            const labelSuccess = document.querySelector(`.label[data-value="${soal.jawaban}"]`);

            if (e.indexSoal == index) {
                soalInduk.forEach(el => {
                    if (e.soal == el.soal) {
                        soalTerjawab.push(e);
                    }
                })
                if (e.jawaban == soal.jawaban) {
                    label.classList.add('benar');
                } else {
                    labelSuccess.classList.add('benar');
                    label.classList.add('salah');
                }
            }
        });

        if (soalTerjawab.length == 0) {
            const labelSuccess = document.querySelector(`.label[data-value="${soal.jawaban}"]`);
            labelSuccess.classList.add('benar');
        }
    }
}

function addPilihan(jawaban) {
    let html = '';

    const label = ['A', 'B', 'C', 'D'];
    jawaban.forEach((e, i) => {
        if (typeof e == 'string') {
            if (e.includes('img')) {
                html += `
                <li>
                    <span class="label" data-value="${i}">${label[i]}</span>
                    <span class="jawaban">
                        <img src="img/${e}">
                    </span>
                </li>
                `;
            } else {
                html += `
                <li>
                    <span class="label" data-value="${i}">${label[i]}</span>
                    <span class="jawaban">${e}</span>
                </li>
                `;
            }
        } else {
            html += `
            <li>
                <span class="label" data-value="${i}">${label[i]}</span>
                <span class="jawaban">${e}</span>
            </li>
            `;
        }
    });

    return html;
}

function load(koreksi = false) {
    if (koreksi) {
        index = 0;
        addSoal(true);
        navbar();

        navbarKlik(true);
        tombolKlik(true)
    } else {
        addSoal();
        navbar();

        navbarKlik();
        pilihanKlik();
        tombolKlik();
    }
}