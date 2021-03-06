var _ = require('lodash');

// german translation of the application
module.exports = {

    testVersion: {
        main: 'Dies ist nur eine Testversion! Sie ist nur teilweise funktionsfähig. Für mehr Informationen folgen sie diesem Link: ',
        link: 'https://github.com/TN1ck/bachelor-thesis'
    },

    label: {
        brand: 'Infoboard',
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
        select: 'Benutzen',
        deleted: '[Gelöscht]'
    },

    boosterPage: {
        header: 'Booster kaufen',
        subHeader: 'Durch den Kauf von Boostern kannst du schneller Punkte sammeln, sie kosten jedoch Punkte und die Dauer ist begrenzt. Es ist immer nur ein Booster aktiv, falls du einen Booster kaufst während ein anderer noch aktiv ist, verfällt dieser.',
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
        }
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
                login: 'hat sich angemeldet.'
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
            body: _.template('Diese Aktion wurde um ${ createdAt } Uhr ausgeführt. Sie hat ${ username } ${ points } Punkte erbracht.')
        },
        badges: {
            header: 'erhielt ein Abzeichen!',
            body: _.template('Das Abzeichen wurde vergeben, weil ${ username } folgendes geleistet hat: ${ why }')
        }
    },

    leaderboard: {
        header: 'Bestenliste',
        alltime: 'Aller Zeiten',
        monthly: 'Dieser Monat'
    },

    auth: {
        everythingWorks: 'Dies ist eine Testversion der eigentlichen Applikationen, jede login Kombination wird funktionieren. z.B. Gast / Passwort.',
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

    userstats: {
        nextLevel: _.template('Das Level wird berechnet indem die Gesamtpunktzahl benutzt wird, ohne die minus-Punkte der Booster mit einzubeziehen. Hierbei haben Sie derzeit eine Punktzahl von ${ points }, Sie benötigen weitere ${ pointsNeeded } Punkte um das nächste Level zu erreichen.'),
        showAllBadges: 'Zeige alle Abzeichen',
        badges: {
            points: 'Punkte hast du für dieses Abzeichen erhalten.',
            pointsWill: 'Punkte würdest du für dieses Abzeichen erhalten.',
            header: 'Abzeichen',
            subHeader: 'Hier Findest du alle Trophäen die du bekommen hast, durch jede Trophäe werden dir Punkte auf deinen Punktestand gutgeschrieben.',
            collected: 'Abzeichen hast du bisher gesammelt.'
        }
    },

    tile: {
        noInteractions: 'keine Interaktionen bisher.',
        tooltip: {
            favourite: {
                favourite: 'Speichere dieses Element in deinen PIA-Favoriten.',
                unfavourite: 'Lösche dieses Element aus deinen PIA-Favoriten'
            },
            vote: 'Bewerte diese Information um deren Sichtbarkeit zu beeinflussen. Die Findung von Informationen wird dadurch durch deine Meinung, für alle Benutzer, beeinflusst.'
        },
        actions: {
            vote: {
                up: 'bewertete dies positiv.',
                down: 'bewertete dies negativ.'
            },
            favourite: {
                toggle: 'favorisierte dies.'
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
        subHeader: 'Hier können Sie permanente Einstellungen am Infoboard vornehmen. Die Änderungen werden sofort übernommen und gespeichert, sie müssen nicht extra neuladen.',
        youAreMissing: 'Dir fehlen',
        rewards: {
            header: 'Freigeschaltete Features',
            subHeader: 'Erreichen Sie eine bestimmte Punktzahl werden hier automatisch Features freigeschaltet.',
            colors: {
                header: 'Farbschemas',
                subHeader: 'Mittels der Farbschema können Sie die Farben der Suchergebnisse variieren. Sie müsen die Seite neu laden um das Schema anzuwenden.'
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
        language: {
            header: 'Sprache',
            subHeader: 'Stellen Sie hier ihre bevorzugte Sprache ein.'
        },
        polling: {
            header: 'Zeitabstand für ein automatische aktualisierung des Inhaltes',
            subHeader: 'Hier können sie den Zeitabstand setzen, bei welchem der Inhalt auf dem Infoboard aktualisiert wird. Diese Einstellung sollte in den meisten Fällen auf "Keine automatische Aktualisierung" gesetzt sein.',
            seconds: _.template('Aktualisiere alle ${ seconds } Sekunden'),
            none: 'Keine automatische Aktualisierung'
        }
    },

    rewards: {
        colors: {

        }
    },

    badges: {
        'login_1': {
            header: 'ANMELDUNG',
            text: 'Melde dich einmal an der DAI-Wall an um diese Trophäe zu erhalten.',
            why: 'Erste Anmeldung an der DAI-Wall.'
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
