const fs = require('fs');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { getGamesData } = require('../src/scrape');

let mock = new MockAdapter(axios);
const TEST_LEAGUE_ID = '45',
    TEST_SEASON_ID = '21',
    TEST_ROUND_ID = '8';
const RAW_RESPONSE = fs.readFileSync('./test/response.xml').toString();

describe('scrape', () => {
    beforeAll(() => {
        mock.onGet(
            'https://www.football.org.il//Components.asmx/League_AllTables',
            {
                params: {
                    league_id: TEST_LEAGUE_ID,
                    season_id: TEST_SEASON_ID,
                    round_id: TEST_ROUND_ID,
                    box: 1,
                    playoffStarts: 0,
                    language_id: -1,
                    dataListBoxes: '',
                },
            }
        ).reply(() => {
            return [200, RAW_RESPONSE];
        });
    });
    afterAll(() => {
        mock.restore();
    });
    test('parses matches correctly', async done => {
        currentRoundGames = await getGamesData(
            TEST_LEAGUE_ID,
            TEST_SEASON_ID,
            TEST_ROUND_ID
        );

        expect(currentRoundGames).toEqual(
            expect.arrayContaining([
                {
                    date: new Date('2019-10-11T13:00:00Z'),
                    homeTeam: 'הפועל ניר רמה"ש',
                    guestTeam: 'הפועל קטמון י-ם',
                    stadium: 'רמת השרון איצטדיון טוטו ע"ש גרונדמן',
                    score: '2 - 0',
                },
            ])
        );
        done();
    });
});
