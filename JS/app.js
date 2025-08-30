$(function () {
    let sound = new Audio("Assets/Song/game_sound.mp3");
    let soundBtnVal = new Audio("Assets/Song/btnValide.mp3");
    let soundBtnBack = new Audio("Assets/Song/btnBack.mp3");
    let soundMute = new Audio("Assets/Song/mute.mp3");
    let winAlert = $('#win__modal');
    let pausedAlert = $('#home__modal');
    let statusUser1 = $('.ready--p1');
    let statusUser2 = $('.ready--p2');
    let scoreP1 = 0;
    let scoreP2 = 0;

    class puissance4 {
        /*Construction du p4 avec par défaut 6 ligne X 7 colonne*/
        constructor($gamesId, $rows = 6, $cols = 7) {
            this.rows = $rows;
            this.cols = $cols;
            this.gamesId = $gamesId;
            this.pos = Array(this.rows);

            this.colStatus = "";
            this.rowStatus = "";


            /*Position pion*/
            for (let i = 0; i < this.rows; i++) {
                this.pos[i] = Array(this.cols).fill(0);
            }
            /*A qui est le tour de joué ? 1 => player1 , 2 => player 2*/
            this.turn = 1;

            /*Le nombre de coup/pions joués*/
            this.moves = 0;

            this.winner = null;

            /*Ciblage p4*/
            this.element = $($gamesId)[0];
            $(this.element).on('click', ((event) => this.clickEvent(event)));

            /*Rendu/affichage du p4*/
            this.render();
        }

        /* Créer et affiche le puissance 4*/
        render() {
            let table = document.createElement('div');
            for (let i = this.rows - 1; i >= 0; i--) {
                let tr = table.appendChild(document.createElement('div'));
                for (let j = 0; j < this.cols; j++) {
                    let td = tr.appendChild(document.createElement('div'));
                    $(td).addClass('cell');

                    /*Couleur des jetons*/
                    let colour = this.pos[i][j];
                    let currentColorP1 = $('.player1__avatar').css('background-color');
                    let currentColorP2 = $('.player2__avatar').css('background-color');
                    if (colour === 1) {
                        $(td).addClass('player' + colour).css('background', currentColorP1);
                    } else if (colour === 2) {
                        $(td).addClass('player' + colour).css('background', currentColorP2);
                    }

                    td.dataset.column = j;

                }
            }
            let leftFoot = table.appendChild(document.createElement('div'));
            let rightFoot = table.appendChild(document.createElement('div'));
            $(leftFoot).addClass('leftFoot');
            $(rightFoot).addClass('rightFoot');
            this.element.innerHTML = '';


            /*Container clickable au dessus du p4*/
            let outerCtn = this.element.appendChild(document.createElement('div'));
            let arrowSelector = outerCtn.appendChild(document.createElement('div'));
            $(outerCtn).addClass('outerClick--container');
            $(arrowSelector).addClass('selector');
            this.moveArrow();



            for (let j = 0; j < this.cols; j++){
                let outerElm = outerCtn.appendChild(document.createElement('div'));
                $(outerElm).addClass('outerClick');
                let cellAnime = outerElm.appendChild(document.createElement('div'));
                $(cellAnime).addClass('cellAnime');
                outerElm.dataset.column = j;
                cellAnime.dataset.column = j;

            }

            this.animate();

            this.element.appendChild(table);

        }

        /*Mouvement de la flèche*/
        moveArrow(){
            const ctn = $("#game");
            const arrow = $(".selector");

            // place la flèche au centre par défaut
            const center = () => {
                const w = ctn.outerWidth();
                const left = ctn.offset().left;
                arrow.css("left", (left + w/2) + "px");
            };

            center();
            $(window).on("resize", center);

            ctn.on("mousemove", (event) => {
                const left = ctn.offset().left;
                const right = left + ctn.outerWidth();
                // clamp dans les bords du conteneur
                const x = Math.max(left, Math.min(event.pageX, right));
                arrow.css("left", x - 50 + "px");
            });
        }

        set(row, column, player) {
            // On colore la case
            this.pos[row][column] = player;
            // On compte le coup
            this.moves++;
        }

        /* Cette fonction ajoute un pion dans une colonne */
        play(column) {
            // Trouver la dernière case libre dans la colonne
            let row;
            for (let i = 0; i < this.rows; i++) {
                if (this.pos[i][column] === 0) {
                    row = i;
                    break;
                }
            }
            if (row === undefined) {
                return null;
            } else {
                // action du coup joué
                console.log("row => " + row);
                console.log("column => " + column);
                this.rowStatus = row;
                this.colStatus = column;
                this.set(row, column, this.turn);
                return row;
            }
        }

        animate(){
            let cible = $('.cellAnime[data-column=\''+this.colStatus+'\']');
            let currentColorP1 = $('.player1__avatar').css('background-color');
            let currentColorP2 = $('.player2__avatar').css('background-color');

            cible.css('display', 'block');
            cible.addClass('fall');

            if (this.turn  === 1) {
                cible.css('background', currentColorP2);
            } else if (this.turn === 2) {
                cible.css('background', currentColorP1);
            }

        }

        clickEvent(event) {
            this.playerRound();

            let column = event.target.dataset.column;
            if (column !== undefined) {
                column = parseInt(column);
                let row = this.play(parseInt(column));
                if (row === null) {
                    console.log("Colonne remplis");
                } else {
                    /* Vérifier si la partie est gagné/finies*/
                    if (this.win(row, column, this.turn)) {
                        this.winner = this.turn;
                    } else if (this.moves >= this.rows * this.cols) {
                        this.winner = 0;
                    }

                    /*Switch au tour du joueur suivant*/
                    this.turn = 3 - this.turn;

                    /* Maj de l'affichage*/
                    this.render()



                    /*Affiche Menu Modal Victoire / Match null*/
                    let winPlayer = $('#winner');
                    let winTextCtn = $('#win__text');
                    switch (this.winner) {
                        case 0:
                            winAlert.fadeIn(300);
                            winAlert.css("display", "flex");
                            $('.modal-header').html('Égalité !');
                            winTextCtn.empty();
                            break;
                        case 1:
                            winAlert.fadeIn(300);
                            winAlert.css("display", "flex");
                            winPlayer.html($('.name__player1').html());
                            scoreP1++
                            obj.showScore($('#team1'), scoreP1);
                            break;
                        case 2:
                            winAlert.fadeIn(300);
                            winAlert.css("display", "flex");
                            winPlayer.html($('.name__player2').html());
                            scoreP2++;
                            obj.showScore($('#team2'), scoreP2);
                            break;
                    }

                }
            }
        }

        /* Vérifie si le coup d'un joueur est gagnant
        * 4 par ligne
        * 4 par colonne
        * 4 par diagonal
        * 4 par diagonal inverse */

        win(row, column, player) {
            // Horizontal
            let count = 0;
            for (let j = 0; j < this.cols; j++) {
                count = (this.pos[row][j] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            // Vertical
            count = 0;
            for (let i = 0; i < this.rows; i++) {
                count = (this.pos[i][column] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            // Diagonal
            count = 0;
            let shift = row - column;
            for (let i = Math.max(shift, 0); i < Math.min(this.rows, this.cols + shift); i++) {
                count = (this.pos[i][i - shift] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            //Diagonal inverse
            count = 0;
            shift = row + column;
            for (let i = Math.max(shift - this.cols + 1, 0); i < Math.min(this.rows, shift + 1); i++) {
                count = (this.pos[i][shift - i] === player) ? count + 1 : 0;
                if (count >= 4) return true;
            }
            return false;
        }


        /*Reset/Vide le p4 => nouvelle game*/
        reset() {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    this.pos[i][j] = 0;
                }
            }
            this.winner = null;
        }

        /*Lance une nouvelle Game*/
        newGame() {
            this.moves = 0;
            this.reset();
            this.render();
            winAlert.fadeOut(300);
            pausedAlert.fadeOut(300);
        }

        playerRound() {
            if (this.turn === 2) {
                $('.player1__avatar').attr('src', 'Assets/Images/userLoad.png');
                $('.round__player').html($('.name__player1').html() + ' à toi de jouer !');
                $('.player2__avatar').attr('src', 'Assets/Images/user2.png');
            } else if (this.turn === 1) {
                $('.round__player').html($('.name__player2').html() + ' à toi de jouer !');
                $('.player2__avatar').attr('src', 'Assets/Images/user2Load.png');
                $('.player1__avatar').attr('src', 'Assets/Images/user.png');
            }
        }

        /*Function annulé le coup précédent*/
        cancelGame() {
            if (this.turn === 1) {
                this.turn++;
            } else if (this.turn === 2) {
                this.turn--;
            }

            let lastCoin = $($('.player' + this.turn)[0])
            this.pos[this.rowStatus][this.colStatus] = 0;
            lastCoin.removeClass();
            lastCoin.css("background", "white");
        }
    }

    /*Création de l'objet de la classe puissance 4 => 2eme argv = row et 3 eme = column*/
    let newGame = new puissance4('#game');

    /*Appel Function annulé le coup précédent*/
    $('.cancel').on('click', function () {
        newGame.playerRound();
        newGame.cancelGame();
    })

    class Interface {

        constructor($homePage, $avatarPage, $p4Page, p4Music) {
            //au click du bouton play cache le menu et affiche la page suivante + son btn
            this.newPage($('.play'), soundBtnVal, $homePage, $avatarPage);
            this.newPage($('.home'), soundBtnBack, $avatarPage, $homePage);
            this.addMusic(p4Music);
            /*Action btn modal*/
            this.newGame($p4Page, $homePage);
            this.selectColorLoop();
            this.isReady();
            this.screenAction($('.fullscreen'));
            /*Pause modal*/
            this.openPaused();
            $('.valide').on('click', function () {
                if (statusUser1.css('display') !== 'none' && statusUser2.css('display') !== 'none') {
                    if (obj.verifySame()) {
                        obj.newPage("", soundBtnBack, $avatarPage, $p4Page);
                    } else {
                        $('.ready--p1 , .ready--p2').slideUp(200);
                        $('.not__ready--p1 , .not__ready--p2').slideDown(300);
                        alert('Couleur ou pseudo identique');
                    }
                }
            })

        }

        verifySame() {
            /*Vérification pseudo et couleur identique*/
            if ($('.name__player1').html() === $('.name__player2').html()) {
                return false;
            } else return $('.player2__avatar').css('background-color') !== $('.player1__avatar').css('background-color');
        }

        newPage($btn, $song, $oldPage = "", $newPage = "") {
            if ($btn !== '') {
                $btn.on('click', function () {
                    $song.play();
                    if ($oldPage !== '' && $newPage !== '') {
                        $oldPage.slideUp(200);
                        $newPage.slideDown(300);
                    }
                    //reset le puissance 4
                    newGame.newGame();
                })
            } else {
                $song.play();
                $oldPage.slideUp(200);
                $newPage.slideDown(200);
                newGame.newGame();
            }

        }

        newGame($p4Page, $homePage) {
            /*Modal victoire => Au click du bouton recommencer reset le jeu et ferme le modal*/
            /*Modal victoire => Action click, back menu , reset, close modal*/
            if (winAlert.css("display") !== null || pausedAlert.css("display") !== null) {
                $('.newGame').on('click', function () {
                    soundBtnVal.play();
                    newGame.newGame();
                });

                $('.home').on('click', function () {
                    soundBtnVal.play();
                    newGame.newGame();
                    obj.newPage('', soundBtnBack, $p4Page, $homePage);
                });

                $('.closeModal').on('click', function () {
                    soundBtnVal.play();
                    pausedAlert.fadeOut(300);
                });
            }
        }

        addMusic($p4Music) {
            let soundIco = $('.sound');
            //ajout de la musique du jeux => button mute/unmute
            soundIco.on('click', function () {
                let clicks = $(this).data('clicks');
                if (clicks) {
                    soundIco.html('<i class="fas fa-volume-mute"></i>');
                    soundMute.play();
                    soundMute.volume = 0.3;
                    $p4Music.volume = 0;
                } else {
                    soundIco.html('<i class="fas fa-volume-up"></i>');
                    $p4Music.play();
                    $p4Music.volume = 0.3;
                    $p4Music.loop = true;
                }
                $(this).data("clicks", !clicks);
            })
        }

        /*color picker*/
        selectColor($cible, $avatar, $newClass) {
            $cible.click(function () {
                $($avatar).removeClass().addClass($newClass);
            });
        }

        selectColorLoop() {
            let count = $('.color__choices div').length;
            for (let i = 1; i <= count; i++) {
                if (i <= 2) {
                    this.selectColor($('label[for=color-' + i + ']'), '.player1__avatar', 'player1__avatar color__' + i);
                } else if (i === 3) {
                    $('label[for=color-' + i + ']').on('click', function () {
                        let cible = $('.player1__avatar');
                        obj.randomColor(cible);
                        cible.removeClass().addClass('player1__avatar');
                    })
                } else if (i === 6) {
                    $('label[for=color-' + i + ']').on('click', function () {
                        let cible = $('.player2__avatar');
                        obj.randomColor(cible);
                        cible.removeClass().addClass('player2__avatar');
                    })
                } else {
                    let nwCount = i - 3;
                    this.selectColor($('label[for=color-' + i + ']'), '.player2__avatar', 'player2__avatar color__' + nwCount);
                }

            }
        }

        /*Validate/ready action user*/
        isReady() {
            this.readyAction($('.pseudo__user2'), $('.name__player2'), $('.ready--btn2'), soundBtnBack, $('.not__ready--p2'), statusUser2, $('.colorBlock--2'));
            this.readyAction($('.pseudo__user1'), $('.name__player1'), $('.ready--btn1'), soundBtnBack, $('.not__ready--p1'), statusUser1, $('.colorBlock--1'));
        }

        readyAction($input, $name, $btn, $audio, $hide, $show, $colorPicker) {
            $btn.on('click', function () {
                $audio.play();
                $hide.slideUp(200);
                $show.slideDown(300);
                $('.round__player').html($('.name__player1')[0].textContent + ' à toi de jouer !');
                if (obj.verifySame()) {
                    $input.attr("disabled", true);
                    $colorPicker.css("pointer-events", "none");
                }

                if ($btn.hasClass("ready--btn1")) {
                    $('html, body').animate({
                        scrollTop: $(".ready--btn2").offset().top - 100 // petit décalage visuel
                    }, 500); // durée en ms
                }

            })

            $input.on('keyup', function () {
                if ($(this).val().trim() === "") {
                    // Si vide → garder le pseudo par défaut
                    $name.html($input.attr("placeholder"));
                } else {
                    $name.html($(this).val());
                }
            });
        }

        /*Couleur aléatoire*/
        randomColor($var) {
            let r = Math.floor(256 * Math.random());
            let g = Math.floor(256 * Math.random());
            let b = Math.floor(256 * Math.random());
            $var.css('background', "rgb(" + r + "," + g + "," + b + ")");
        }

        /*Affiche le score*/
        showScore($team, $score) {
            $('.btn').on('click', function () {
                $team.html($score);
            })
        }

        /*Button full screen*/
        screenAction($elem) {
            $elem.on('click', function () {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                    $('.p4_logo').css("width", '30%');
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                        $('.p4_logo').css("width", '25%');
                    }
                }
            })
        }

        openPaused() {
            $('.paused').on('click', function () {
                pausedAlert.fadeIn(300);
            })
        }


    }

    /*Création de l'objet de la classe Interface*/
    let obj = new Interface($('#Page1'), $('#Page2'), $('#Page3'), sound);

    $('.pseudo__user1').val("Joueur 1");
    $('.name__player1').text("Joueur 1");

    $('.pseudo__user2').val("Joueur 2");
    $('.name__player2').text("Joueur 2");

    // Couleur par défaut Joueur 1
    $('.player1__avatar')
        .css('background', '#ff4949') // rouge par défaut
        .removeClass()
        .addClass('player1__avatar color__2');
    $('#color-2').prop('checked', true); // coche le bon bouton

// Couleur par défaut Joueur 2
    $('.player2__avatar')
        .css('background', '#ff0') // jaune par défaut
        .removeClass()
        .addClass('player2__avatar color__1');
    $('#color-4').prop('checked', true); // coche le bon bouton
})




