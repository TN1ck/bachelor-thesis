var _ = require('lodash');

module.exports = {

    label: {
        brand: 'DAIWALL',
        points: 'Punkte',
        level: 'Level',
        place: 'Platz',
        settings: 'Einstellungen',
        badges: 'Abzeichen',
        booster: 'Booster',
        stats: 'Statistik',
        login: 'Login',
        logout: 'Logout',
        vote: 'Bewerten',
        query: 'Suchen',
        badge: 'Abzeichen',
        favourite: 'Favorisieren',
        name: 'Name',
        active: 'aktiv',
        currentlySelected: 'Aktuell ausgewählt',
        select: 'Benutzen'
    },

    boosterPage: {
        header: 'Booster kaufen',
        subHeader: 'Mittels von Booster können Sie schneller Punkte sammeln, sie kosten jedoch Punkte und die Dauer ist begrenzt.',
        timeLeft: 'Booster aktiv, verbleibende Zeit:',
        bought: 'Booster hast du bisher gekauft.',
        isActive: 'Dieser Booster ist im Moment aktiv.',
        missing: 'Es fehlen',
        buyFor: 'Kaufe für'
    },

    booster: {
        'booster_x2_1': {
            name: 'VERDOPPLUNG DER PUNKTE FÜR 1 TAG',
            text: 'Verdoppel deine Punkte für 1 Tag.'
        },
        'booster_x2_2': {
            name: 'VERDOPPLUNG DER PUNKTE FÜR 2 TAG',
            text: 'Verdoppel deine Punkte für 2 Tage.'
        },
        'booster_x3_1': {
            name: 'VERDREIFACHUNG DER PUNKTE FÜR 1 TAG',
            text: 'Verdreifache deine Punkte für 1 Tag.'
        },
        'booster_x3_2': {
            name: 'VERDREIFACHUNG DER PUNKTE FÜR 2 TAGE',
            text: 'Verdreifache deine Punkte für 2 Tage.'
        },
    },

    messages: {
        badge: {
            header: 'Du hast ein Abzeichen erhalten!',
            body: 'Punkte hast du dafür bekommen.'
        },
        booster: {
            header: 'Booster erfolgreich erworben!'
        },
        level: {
            header: _.template('Level ${ level } erreicht!'),
            body: 'Dadurch wurden neue Features freigschaltet, gehen zu den Einstellungen um sie zu benutzen!'
        }
    },

    stats: {
        actions: {
            auth: {
                login: 'hat sicht angemeldet.'
            },
            query: {
                add: 'hat nach etwas gesucht.',
                remove: 'hat eine Suche entfernt.'
            },
            favourite: {
                toggle: 'hat etwas favorisiert.'
            },
            vote: {
                up: 'hat etwas positiv bewertet.',
                down: 'hat etwas negativ bewertet.'
            },
            body: _.template('Dies Aktion wurde um ${ createdAt } Uhr ausgeführt. Sie hat ${ username } ${ points } Punkte erbracht.')
        },
    },

    leaderboard: {
        header: 'Bestenliste',
        alltime: 'Aller Zeiten',
        monthly: 'Dieser Monat'
    },

    auth: {
        label: {
            login: 'Anmelden',
            logout: 'Abmelden',
            wall: 'Zur DAI-Wall',
            username: 'Benutzername',
            password: 'Password',
            remember: 'Angemeldet bleiben'
        },
        logout: {
            success: 'Sie haben sich erfolgreich ausgeloggt.',
            again: 'Melden Sie sich an um wieder die Enterprise-Wall wieder zu benutzen.'
        },
        login: {
            already: 'Sie sind bereits angemeldet, wollen sie sich abmelden?',
            error: {
                text: 'Ein Fehler ist aufgetreten, bitte stellen Sie sicher das ihr Benutzername und das zugehörige Passwort korrekt sind.',
                header: 'Oh nein...'
            }

        }
    },

    badgesPage: {
        nextLevel: 'Punkte benötigst du um das nächste Level zu erreichen.',
        badges: {
            points: 'hast du für dieses Abzeichen erhalten.',
            header: 'Abzeichen',
            subHeader: 'Hier Findest du alle Trophäen die du bekommen hast, durch jede Trophäe werden dir Punkte auf deinen Punktestand gutgeschrieben.',
            collected: 'hast du bisher gesammelt.'
        }
    },

    tile: {
        noInteraction: 'keine Interaktionen bisher.',
        tooltip: {
            favourite: {
                favourite: 'Speichere dieses Element in deinen PIA-Favoriten.',
                unfavourite: 'Lösche dieses Element aus deinen PIA-Favoriten'
            },
            vote: 'Bewerte dieses Suchergebnis um die Sichtbarkeit des Suchergebnisses zu beeinflussen. Die Suchergebnisse aller Benutzer werden dadurch durch deine Meinung beeinflusst.'
        },
        actions: {
            vote: {
                up: 'berwertete dies positiv.',
                down: 'berwertete dies negativ.',
            },
            favourite: {
                toggle: 'favorisierte dies.',
            }
        }
    },

    header: {
        label: {
            loginAs: 'Angemeldet als',
            month: 'diesen Monat',
            alltime: 'Gesamt'
        }
    },

    settings: {
        header: 'Einstellungen',
        subHeader: 'Hier können Sie permanente Einstellungen an der DAI-wall vornehmen. Klicken Sie auf speichern um die Änderungen zu übernehmen.',
        youAreMissing: 'Dir fehlen',
        rewards: {
            header: 'Freigeschaltete Features',
            subHeader: 'Erreichen Sie eine bestimmte Punktzahl werden hier automatisch Features freigeschaltet.',
            colors: {
                header: 'Farbschemas',
                subHeader: 'Mittels der Farbschema können Sie die Farben der Suchergebnisse variieren. Sie müsen die Seite neu laden um das Schema anzuwenden.',
            },
            backgrounds: {
                header: 'Hintergrundbilder und Farben',
                subHeader: 'Mittels der Hintergrundbilder können Sie den global genutzten Hintergrund anpassen.'
            },
            advanced: {
                header: 'Erweiterte Funktionen',
                subHeader: 'Durch Erweiterte Funktionen erhalten Sie mehr Macht in der Darstellung der Suchergebnissen, sei es die Art der Gruppierung oder die Prioriesierung der Broker.'
            }
        },
    },

    rewards: {
        colors: {

        }
    },

    badges: {
        'login_1': {
            header: 'ANMELDUNG',
            text: 'Melde dich einmal an der DAI-Wall an um diese Trophäe zu erhalten.',
            why: 'Erste Anmeldung and der DAI-Wall.'
        },

        'login_50': {
            header: 'ANMELDUNGEN',
            text: 'Melde dich 50 mal an verschiedenen Tagen an der DAI-Wall an um diese Trophäe zu erhalten.',
            why: '50 Anmeldungen an der DAI-Wall zu verschiedenen Tagen.'
        },

        'login_100': {
            header: 'ANMELDUNGEN',
            text: 'Melde dich 100 mal an verschiedenen Tagen an der DAI-Wall an um diese Trophäe zu erhalten.',
            why: '100 Anmeldungen an der DAI-Wall zu verschiedenen Tagen.'
        },

        'login_3_c': {
            header: 'TAGE IN FOLGE',
            text: 'Melde dich an 3 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
            why: '3 Anmeldungen an aufeinanderfolgenden Tagen.'
        },

        'login_7_c': {
            header: 'TAGE IN FOLGE',
            text: 'Melde dich an 7 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
            why: '7 Anmeldungen an aufeinanderfolgenden Tagen.'
        },

        'repeat_15_c': {
            header: 'TAGE IN FOLGE',
            text: 'Melde dich an 15 aufeinanderfolgenden Tagen an der DAI-Wall an um diese Trophäe zu erhalten',
            why: '15 Anmeldungen an aufeinanderfolgenden Tagen.'
        },

        'upvotes_10': {
            header: 'UPVOTES',
            text: 'Bewerte mindestens 10 Suchergebnisse positiv um diese Trophäe zu erhalten.',
            why: '10 Suchergebnisse wurden positiv bewertet.'
        },

        'upvotes_100': {
            header: 'UPVOTES',
            text: 'Bewerte mindestens 100 Suchergebnisse positiv um diese Trophäe zu erhalten.',
            why: '100 Suchergebnisse wurden positiv bewertet.'
        },

        'upvotes_1000': {
            header: 'UPVOTES',
            text: 'Bewerte mindestens 1000 Suchergebnisse positiv um diese Trophäe zu erhalten.',
            why: '1000 Suchergebnisse wurden positiv bewertet.'
        },

        'downvotes_10': {
            header: 'DOWNVOTES',
            text: 'Bewerte mindestens 10 Suchergebnisse negativ um diese Trophäe zu erhalten.',
            why: '10 Suchergebnisse wurden negativ bewertet.'
        },

        'downvotes_100': {
            header: 'DOWNVOTES',
            text: 'Bewerte mindestens 100 Suchergebnisse negativ um diese Trophäe zu erhalten.',
            why: '100 Suchergebnisse wurden negativ bewertet.'
        },

        'downvotes_1000': {
            header: 'DOWNVOTES',
            text: 'Bewerte mindestens 1000 Suchergebnisse negativ um diese Trophäe zu erhalten.',
            why: '1000 Suchergebnisse wurden negativ bewertet.'
        },

        'queries_add_10': {
            header: 'SUCHEN',
            text: 'Suche mindestens nach 10 Suchbegriffen um diese Trophäe zu erhalten',
            why: '10 Begriffe wurden gesucht.'
        },

        'queries_add_100': {
            header: 'SUCHEN',
            text: 'Suche mindestens nach 100 Suchbegriffen um diese Trophäe zu erhalten',
            why: '100 Begriffe wurden gesucht.'
        },

        'queries_add_1000': {
            header: 'SUCHEN',
            text: 'Suche mindestens nach 1000 Suchbegriffen um diese Trophäe zu erhalten',
            why: '1000 Begriffe wurden gesucht.'
        },

        'favourites_10': {
            header: 'FAVORITEN',
            text: 'Favorisiere mindestens nach 10 Suchergebnisse um diese Trophäe zu erhalten',
            why: '10 Suchergebnisse wurden favorisiert.'
        },

        'favourites_50': {
            header: 'FAVORITEN',
            text: 'Favorisiere mindestens nach 50 Suchergebnisse um diese Trophäe zu erhalten',
            why: '50 Suchergebnisse wurden favorisiert.'
        },

        'favourites_100': {
            header: 'FAVORITEN',
            text: 'Favorisiere mindestens nach 100 Suchergebnisse um diese Trophäe zu erhalten',
            why: '100 Suchergebnisse wurden favorisiert.'
        }
    }
};
