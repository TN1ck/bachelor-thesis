var _      = require('lodash');
var models = require('../models');
var POINTS = require('../../frontend/shared/gamification/points');
var BADGES = require('../../frontend/shared/gamification/badges');

var User = models.User;
var Action = models.Action;
var Vote = models.Vote;
var Item = models.Item;
var Badge = models.Badge;
var sequelize = models.sequelize;

//
// Fill the database with mockup data
//

var NAMES = ['Agnes', 'Agnieszka', 'Alexandra', 'Alina', 'Alma', 'Amelie', 'Andrea', 'Anett', 'Anette', 'Angela', 'Angelica', 'Angelika', 'Anica', 'Anika', 'Anita', 'Anja', 'Anke', 'Ann', 'Anna', 'Anne', 'Anneliese', 'Annemarie', 'Annett', 'Annette', 'Anni', 'Annica', 'Annie', 'Annika', 'Anny', 'Antje', 'Antonia', 'Ariane', 'Astrid', 'Auguste', 'Ayse', 'Bärbel', 'Barbara', 'Beata', 'Beate', 'Beatrice', 'Berit', 'Berta', 'Bertha', 'Bettina', 'Bianca', 'Bianka', 'Birgit', 'Birgitt', 'Birte', 'Birthe', 'Brigitte', 'Britta', 'Caren', 'Carina', 'Carla', 'Carmen', 'Carola', 'Carolin', 'Caroline', 'Catarina', 'Catharina', 'Cathleen', 'Cathrin', 'Catrin', 'Celina', 'Charlotte', 'Christa', 'Christel', 'Christiane', 'Christin', 'Christina', 'Christine', 'Cindy', 'Clara', 'Claudia', 'Constanze', 'Cordula', 'Corinna', 'Cornelia', 'Dörte', 'Dörthe', 'Dagmar', 'Dana', 'Daniela', 'Denise', 'Diana', 'Dora', 'Doreen', 'Doris', 'Dorothea', 'Dorothee', 'Edith', 'Elena', 'Elfriede', 'Elisabeth', 'Elise', 'Elke', 'Ella', 'Elli', 'Elly', 'Elsa', 'Else', 'Emilia', 'Emilie', 'Emily', 'Emine', 'Emma', 'Erika', 'Erna', 'Esther', 'Eva', 'Evelin', 'Eveline', 'Evelyn', 'Evelyne', 'Ewa', 'Fatma', 'Filiz', 'Franziska', 'Frauke', 'Frida', 'Frieda', 'Friederike', 'Gabi', 'Gabriela', 'Gabriele', 'Gaby', 'Gerda', 'Gertrud', 'Gesa', 'Gisela', 'Grit', 'Hanna', 'Hannah', 'Hannelore', 'Hatice', 'Hedwig', 'Heidi', 'Heike', 'Helena', 'Helene', 'Helga', 'Henni', 'Henny', 'Herta', 'Hertha', 'Hildegard', 'Ida', 'Ilka', 'Ilona', 'Ilse', 'Imke', 'Ina', 'Ines', 'Inga', 'Inge', 'Ingeborg', 'Ingrid', 'Irene', 'Irina', 'Iris', 'Irma', 'Irmgard', 'Isabel', 'Isabell', 'Isabella', 'Isabelle', 'Ivonne', 'Jacqueline', 'Jana', 'Janet', 'Janett', 'Janette', 'Janin', 'Janina', 'Janine', 'Jaqueline', 'Jasmin', 'Jeanette', 'Jeannette', 'Jennifer', 'Jenny', 'Jessica', 'Jessika', 'Joanna', 'Johanna', 'Judith', 'Julia', 'Juliane', 'Jutta', 'Käte', 'Käthe', 'Karen', 'Karin', 'Karina', 'Karla', 'Karola', 'Karolin', 'Karoline', 'Katarina', 'Katarzyna', 'Katharina', 'Kathi', 'Kathie', 'Kathleen', 'Kathrin', 'Kati', 'Katie', 'Katja', 'Katrin', 'Kerstin', 'Kim', 'Kirsten', 'Kirstin', 'Klara', 'Klaudia', 'Konstanze', 'Kordula', 'Korinna', 'Kornelia', 'Kristiane', 'Kristin', 'Kristina', 'Kristine', 'Lara', 'Larissa', 'Laura', 'Lea', 'Leah', 'Lena', 'Leni', 'Leoni', 'Leonie', 'Lidia', 'Lieselotte', 'Lili', 'Lilli', 'Lilly', 'Lina', 'Linda', 'Lisa', 'Liselotte', 'Lotte', 'Louisa', 'Louise', 'Luisa', 'Luise', 'Lydia', 'Magdalena', 'Maike', 'Maja', 'Malgorzata', 'Mandy', 'Manja', 'Manuela', 'Mareike', 'Maren', 'Margarete', 'Margarethe', 'Margot', 'Margrit', 'Maria', 'Marianne', 'Marie', 'Marina', 'Marion', 'Marta', 'Martha', 'Martina', 'Maya', 'Meike', 'Melanie', 'Melina', 'Melissa', 'Meta', 'Metha', 'Mia', 'Michaela', 'Michelle', 'Minna', 'Miriam', 'Mirja', 'Mirjam', 'Monika', 'Monique', 'Nadin', 'Nadine', 'Nadja', 'Nancy', 'Natalia', 'Natalie', 'Natascha', 'Nathalie', 'Neele', 'Nele', 'Nicola', 'Nicole', 'Nikola', 'Nina', 'Olga', 'Pamela', 'Patricia', 'Patrizia', 'Paula', 'Peggy', 'Petra', 'Ramona', 'Rebecca', 'Rebekka', 'Regina', 'Renate', 'Rita', 'Rosemarie', 'Ruth', 'Sabine', 'Sabrina', 'Sandra', 'Sara', 'Sarah', 'Saskia', 'Sibylle', 'Sigrid', 'Silke', 'Silvia', 'Simone', 'Sina', 'Sinah', 'Sofia', 'Sofie', 'Sonja', 'Sophia', 'Sophie', 'Stefanie', 'Steffi', 'Stephanie', 'Susan', 'Susann', 'Susanne', 'Svantje', 'Svenja', 'Svetlana', 'Swantje', 'Swenja', 'Swetlana', 'Sybille', 'Sylke', 'Sylvia', 'Sylwia', 'Tamara', 'Tania', 'Tanja', 'Tatjana', 'Tina', 'Ulrike', 'Ursula', 'Uta', 'Ute', 'Vanessa', 'Vera', 'Verena', 'Veronica', 'Veronika', 'Victoria', 'Viktoria', 'Viola', 'Waltraud', 'Waltraut', 'Wera', 'Wibke', 'Wiebke', 'Wilhelmine', 'Yasemin', 'Yasmin', 'Yvonne', 'Adolf', 'Albert', 'Alexander', 'Alfred', 'André', 'Andre', 'Andreas', 'Arthur', 'Artur', 'August', 'Axel', 'Ben', 'Benjamin', 'Bernd', 'Björn', 'Bruno', 'Carl', 'Carsten', 'Christian', 'Christoph', 'Claus', 'Curt', 'Daniel', 'David', 'Dennis', 'Dieter', 'Dirk', 'Dominic', 'Dominik', 'Elias', 'Emil', 'Eric', 'Erich', 'Erik', 'Ernst', 'Erwin', 'Fabian', 'Felix', 'Finn', 'Florian', 'Frank', 'Franz', 'Friedrich', 'Fritz', 'Fynn', 'Günter', 'Günther', 'Georg', 'Gerd', 'Gerhard', 'Gert', 'Gustav', 'Hans', 'Harald', 'Harri', 'Harry', 'Heinrich', 'Heinz', 'Hellmut', 'Helmut', 'Helmuth', 'Herbert', 'Hermann', 'Holger', 'Horst', 'Hugo', 'Ingo', 'Jörg', 'Jürgen', 'Jacob', 'Jakob', 'Jan', 'Jannik', 'Jens', 'Joachim', 'Johann', 'Johannes', 'Jonas', 'Jonathan', 'Josef', 'Joseph', 'Julian', 'Justin', 'Kai', 'Karl', 'Karl-Heinz', 'Karlheinz', 'Karsten', 'Kay', 'Kevin', 'Klaus', 'Kristian', 'Kurt', 'Lars', 'Lennard', 'Lennart', 'Leon', 'Lothar', 'Louis', 'Luca', 'Lucas', 'Ludwig', 'Luis', 'Luka', 'Lukas', 'Lutz', 'Maik', 'Manfred', 'Marc', 'Marcel', 'Marco', 'Marcus', 'Mario', 'Mark', 'Marko', 'Markus', 'Martin', 'Marvin', 'Mathias', 'Matthias', 'Max', 'Maximilian', 'Meik', 'Michael', 'Mike', 'Moritz', 'Nick', 'Niclas', 'Nico', 'Niels', 'Niklas', 'Niko', 'Nils', 'Noah', 'Norbert', 'Olaf', 'Ole', 'Oliver', 'Oscar', 'Oskar', 'Otto', 'Patrick', 'Paul', 'Peter', 'Philip', 'Philipp', 'Phillipp', 'Rainer', 'Ralf', 'Ralph', 'Reiner', 'René', 'Richard', 'Robert', 'Rolf', 'Rudolf', 'Rudolph', 'Sascha', 'Sebastian', 'Siegfried', 'Simon', 'Stefan', 'Steffen', 'Stephan', 'Sven', 'Swen', 'Thomas', 'Thorsten', 'Tim', 'Timm', 'Tobias', 'Tom', 'Torsten', 'Ulrich', 'Uwe', 'Volker', 'Walter', 'Walther', 'Werner', 'Wilhelm', 'Willi', 'Willy', 'Wolfgang', 'Yannic', 'Yannick', 'Yannik'];
// wurst
var wurst = ['http://www.tu-berlin.de/?id=65718', 'http://www.tu-berlin.de/?id=78442', 'http://www.tu-berlin.de/fileadmin/f3/PIW/PIW2013-14/Einfuehrung_in_die_Nutzung_der_Universitaetsbibliothek_2013_12_13.pdf', 'http://www.tu-berlin.de/fileadmin/abt4/Bilder/JPG/Welcome_Center/Wohnungsboerse/Expose_Winterfeldtstrasse.pdf', 'http://www.tu-berlin.de/fileadmin/f27/PDFs/Publikationen/Broschuere_Kurfuersten.pdf', 'http://www.tu-berlin.de/fileadmin/f3/PIW/PIW2012-13/PIW2012-13_Zeitplan_2012-10-25.pdf', 'http://www.tu-berlin.de/uploads/media/Nr_20_Herde_01.pdf', 'http://www.tu-berlin.de/uploads/media/Nr_30_Noelting.pdf'];
// gamification
var gamification = ['https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2172', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2166', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2100', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2077', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2050', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2020', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2019', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2005', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1987', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1928', 'http://gamifir.dai-labor.de/organizers/feed/', 'http://gamifir.dai-labor.de/program/feed/', 'http://gamifir.dai-labor.de/sample-page/feed/', 'http://gamifir.dai-labor.de/submission/feed/', 'http://gamifir.dai-labor.de/home/feed/', 'http://www.dai-labor.de/en/cog/research/robocup/', 'http://www.dai-labor.de/en/cog/research/uas/', 'http://www.dai-labor.de/en/competence_centers/cognitive_architectures/education/', 'http://www.dai-labor.de/cog/lehre/', 'http://www.dai-labor.de/de/cog/forschung/robocup/', 'http://www.dai-labor.de/publikationen/967', 'http://www.dai-labor.de/publikationen/987', 'http://www.dai-labor.de/publikationen/944', 'http://www.dai-labor.de/publikationen/923', 'http://www.dai-labor.de/publikationen/922', 'http://www.dai-labor.de/publikationen/860', 'http://www.dai-labor.de/publikationen/613'];
// test
var test = ['https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2140', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1600', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/25', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2128', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2149', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1040', 'http://www.dai-labor.de/publikationen/87', 'http://www.dai-labor.de/publikationen/861', 'http://www.dai-labor.de/publikationen/843', 'http://www.dai-labor.de/publikationen/473', 'http://www.dai-labor.de/publikationen/951', 'http://www.dai-labor.de/publikationen/580', 'http://www.dai-labor.de/publikationen/490', 'http://www.dai-labor.de/publikationen/985', 'http://www.dai-labor.de/publikationen/455', 'http://www.dai-labor.de/publikationen/964', 'http://www.dai-labor.de/fileadmin/Files/Publikationen/Buchdatei/blumendorf_marco.pdf', 'http://www.dai-labor.de/fileadmin/Files/Publikationen/Buchdatei/Kuster2013Distributed.pdf', 'http://www.tu-berlin.de/fileadmin/f27/PDFs/Forschung/GENDERACE_FINAL_REPORT.pdf', 'http://www.tu-berlin.de/fileadmin/f27/PDFs/Publikationen/20110711_cerrillo-martinez_peguera_pena-lopez_vilasau-solana__2011__idp2011_proceedings_net_neutrality.pdf', 'http://www.tu-berlin.de/fileadmin/f27/PDFs/Forschung/SIAM/9.7_A_Comparative_report_with_regard_to_the_respective_case_studies_and_the_international_state_of_art.pdf', 'http://www.tu-berlin.de/fileadmin/f3/FKR/13._Sitzung/Anlage_TOP_9.2a_UWI2-5April14.pdf'];
// berlin
var berlin = ['https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2152', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2142', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/2016', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1812', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1533', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1383', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1295', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1289', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1268', 'https://daiknow.dai-labor.de/DAIKnowWebGui/items/details/1144'];

var ITEMS = _.range(300).concat(wurst, gamification, test, berlin);

var users          = 5;
var actionsPerUser = 500;
var votesPerUser   = 50;
var items          = 100;
var badgesPerUser  = 10;


var usersToInsert = _.sample(NAMES, users).map(function(name) {
    return {
        username: name
    }
});

User.bulkCreate(usersToInsert).then(function() {
    var itemsToInsert = _.sample(ITEMS, items).map(function(i) {
        return {
            uuid: i
        };
    });
    User.findAll().then(function(_users) {

        // create items

        Item.bulkCreate(itemsToInsert).then(function () {

            Item.findAll().then(function(_items) {
                var votesToInsert = _.range(votesPerUser * users).map(function (i) {
                    return {
                        value: _.sample([-1, 1])
                    }
                });

                // create votes
                Vote.bulkCreate(votesToInsert).then(function () {
                    Vote.findAll().then(function(_votes) {
                        _votes.forEach(function(vote) {
                            vote.setUser(_.sample(_users));
                            vote.setItem(_.sample(_items));
                        });
                    });
                });

                // create actions

                var actionsToInsert = _.range(users * actionsPerUser).map(function () {
                    var group = _.sample(_.pairs(POINTS));
                    var label = _.sample(_.pairs(group[1]));

                    return {
                        group: group[0],
                        label: label[0],
                        points: label[1]
                    };
                });

                Action.bulkCreate(actionsToInsert).then(function() {
                    Action.findAll().then(function(_actions) {
                        _actions.forEach(function(action) {
                            action.setUser(_.sample(_users));
                            var group = action.get('group');
                            if (['auth', 'search'].indexOf(group) === -1) {
                                var _item = _.sample(_items);
                                action.setItem(_item).then(function(_action) {
                                    // _item.setActions([_action]);
                                });
                            }
                        });
                    });
                });

            });

        });

    });
});
