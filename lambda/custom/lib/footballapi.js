const axios = require("axios");
let config = require("./config");
let apiKey = config.api_key;

class FootballApi {
  static getLeague(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`http://api.football-data.org//v2/competitions/${id}`, {
          headers: { "X-Auth-Token": apiKey }
        })
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  static getFixtures(id, matchday) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `http://api.football-data.org/v2/competitions/${id}/matches\?matchday\=${matchday}`,
          {
            headers: { "X-Auth-Token": apiKey }
          }
        )
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    });
  }
}

module.exports = FootballApi;
