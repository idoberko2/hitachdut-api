const cheerio = require('cheerio');
const axios = require('axios');
const parser = require('xml2js').Parser();
const moment = require('moment-timezone');

function trimHomeTeam(rawTeam) {
    return rawTeam.replace(/\s+\-\s+$/, '');
}

function strToDate(rawDate, rawTime) {
    if (rawDate == null) {
        return null;
    }

    // build date without timezone
    const [day, month, year] = rawDate.split('/');
    const dateNoTz = new Date();
    dateNoTz.setDate(day);
    dateNoTz.setMonth(month - 1);
    dateNoTz.setFullYear(year);

    if (rawTime != null && /^\d\d\:\d\d$/.test(rawTime)) {
        const [hour, minutes] = rawTime.split(':');

        dateNoTz.setHours(hour);
        dateNoTz.setMinutes(minutes);
    } else {
        dateNoTz.setHours(0);
        dateNoTz.setMinutes(0);
    }

    dateNoTz.setSeconds(0, 0);

    // setting correct timezone
    dateToReturn = moment.tz(dateNoTz, 'Asia/Jerusalem');

    return new Date(dateToReturn.format());
}

async function getTables(league_id, season_id, round_id) {
    const response = await axios.get(
        'https://www.football.org.il//Components.asmx/League_AllTables',
        {
            params: {
                league_id,
                season_id,
                round_id,
                box: 1,
                playoffStarts: 0,
                language_id: -1,
                dataListBoxes: '',
            },
        }
    );
    const parsedResponse = await parser.parseStringPromise(response.data);

    return Promise.resolve(parsedResponse.ResponseData.HtmlData[0]);
}

function gamesFromHtml(html) {
    const $ = cheerio.load(html);
    const gamesTable = $('.league-games')[0];

    if (gamesTable == null) {
        return null;
    }

    const games = gamesTable.childNodes.slice(1);
    return games.map(game => {
        const date = strToDate(
            game.childNodes[0].lastChild.data.trim(),
            game.childNodes[3].lastChild.data.trim()
        );
        const homeTeam = trimHomeTeam(
            game.childNodes[1].childNodes[1].firstChild.data
        );
        const guestTeam = game.childNodes[1].childNodes[2].firstChild.data;
        const stadium = game.childNodes[2].lastChild.data;
        const score = game.childNodes[4].lastChild.data;

        return { date, homeTeam, guestTeam, stadium, score };
    });
}

async function getGamesData(league_id, season_id, round_id) {
    const gamesHtml = await getTables(league_id, season_id, round_id);
    return gamesFromHtml(gamesHtml);
}

// getGamesData(45, 21, 16).then(data => console.log(data));

module.exports = { getGamesData };
