/* @flow */

import { $ } from '../../vendor';
import { Host } from '../../core/host';
import { ajax } from '../../environment';

export default new Host('eliteprospects', {
	name: 'eliteprospects',
	domains: ['eliteprospects.com'],
	logo: 'http://www.eliteprospects.com/favicon.ico',
	detect: ({ pathname, search }) => (pathname === '/player.php') && (/(?:\?|&)player=(\d+)/i).exec(search),
	async handleLink(href, [, playerid]) {
		const url = `http://api.eliteprospects.com/beta/players/${playerid}/stats?limit=100&sort=season.startYear:asc`;
		const data = await ajax({
			url,
		});

		const goalieStats = '<th>GP</th><th>GAA</th><th>SVS%</th>';
		const skaterStats = '<th>GP</th><th>G</th><th>A</th><th>TP</th><th>PIM</th>';

		function getHeader(type) {
			let header = '<tr><th>Season</th><th>Team</th><th>League</th>';
			header += type === 'GOALIE' ? goalieStats : skaterStats;
			header += '<th>Postseason</th>';
			header += type === 'GOALIE' ? goalieStats : skaterStats;
			header += '</tr>';
			return header;
		}

		function getSkaterStats(json) {
			const $stats = $('<table>');
			$stats.append(getHeader(json.data[0].playerPosition));
			const postSeason = [];
			$(json.data).each((index, season) => {
				if (season.gameType === 'REGULAR_SEASON' || season.gameType === 'CUP') {
					const $row = $('<tr>');
					$row.append(`<td>${season.season.name}</td>`);
					if (season.playerRole === 'CAPTAIN') {
						$row.append(`<td>${season.team.name} <b>C</b></td>`);
					} else if (season.playerRole === 'ASSISTANT_CAPTAIN') {
						$row.append(`<td>${season.team.name} <b>A</b></td>`);
					} else {
						$row.append(`<td>${season.team.name}</td>`);
					}
					$row.append(`<td>${season.league.name}</td>`);
					if (season.GP !== undefined) {
						$row.append(`<td>${season.GP}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.G !== undefined) {
						$row.append(`<td>${season.G}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.A !== undefined) {
						$row.append(`<td>${season.A}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.TP !== undefined) {
						$row.append(`<td>${season.TP}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.PIM !== undefined) {
						$row.append(`<td>${season.PIM}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					$stats.append($row);
				} else if (season.gameType === 'PLAYOFFS' || season.gameType === 'RELEGATION') {
					postSeason.push(season);
				} else {
					console.log(`GameType ${season.gameType} not handled`);
				}
			});
			$(postSeason).each((index, season) => {
				let added = false;
				$($stats[0].childNodes).each((index, row) => {
					let team = season.team.name;
					if (season.playerRole === 'CAPTAIN') {
						team += ' C';
					} else if (season.playerRole === 'ASSISTANT_CAPTAIN') {
						team += ' A';
					}
					if ($(row)[0].childNodes[0].textContent === season.season.name && $(row)[0].childNodes[1].textContent === team && $(row)[0].childNodes[2].textContent === season.league.name) {
						if (season.gameType === 'PLAYOFFS') {
							$(row).append('<td>Playoffs</td>');
						} else {
							$(row).append('<td>Relegation</td>');
						}
						if (season.GP !== undefined) {
							$(row).append(`<td>${season.GP}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.G !== undefined) {
							$(row).append(`<td>${season.G}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.A !== undefined) {
							$(row).append(`<td>${season.A}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.TP !== undefined) {
							$(row).append(`<td>${season.TP}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.PIM !== undefined) {
							$(row).append(`<td>${season.PIM}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						added = true;
						return false;
					}
				});
				if (!added) {
					console.log('Regular Season not found for');
					console.log(season);
				}
			});
			return $stats;
		}

		function getGoalieStats(json) {
			const $stats = $('<table>');
			$stats.append(getHeader(json.data[0].playerPosition));
			const postSeason = [];
			$(json.data).each((index, season) => {
				if (season.gameType === 'REGULAR_SEASON' || season.gameType === 'CUP') {
					const $row = $('<tr>');
					$row.append(`<td>${season.season.name}</td>`);
					if (season.playerRole === 'CAPTAIN') {
						$row.append(`<td>${season.team.name} <b>C</b></td>`);
					} else if (season.playerRole === 'ASSISTANT_CAPTAIN') {
						$row.append(`<td>${season.team.name} <b>A</b></td>`);
					} else {
						$row.append(`<td>${season.team.name}</td>`);
					}
					$row.append(`<td>${season.league.name}</td>`);
					if (season.GP !== undefined) {
						$row.append(`<td>${season.GP}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.GAA !== undefined) {
						$row.append(`<td>${season.GAA}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					if (season.SVP !== undefined) {
						$row.append(`<td>${season.SVP}</td>`);
					} else {
						$row.append('<td>-</td>');
					}
					$stats.append($row);
				} else if (season.gameType === 'PLAYOFFS' || season.gameType === 'RELEGATION') {
					postSeason.push(season);
				} else {
					console.log(`GameType ${season.gameType} not handled`);
				}
			});
			$(postSeason).each((index, season) => {
				let added = false;
				$($stats[0].childNodes).each((index, row) => {
					let team = season.team.name;
					if (season.playerRole === 'CAPTAIN') {
						team += ' C';
					} else if (season.playerRole === 'ASSISTANT_CAPTAIN') {
						team += ' A';
					}
					if ($(row)[0].childNodes[0].textContent === season.season.name && $(row)[0].childNodes[1].textContent === team && $(row)[0].childNodes[2].textContent === season.league.name) {
						if (season.gameType === 'PLAYOFFS') {
							$(row).append('<td>Playoffs</td>');
						} else {
							$(row).append('<td>Relegation</td>');
						}
						if (season.GP !== undefined) {
							$(row).append(`<td>${season.GP}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.GAA !== undefined) {
							$(row).append(`<td>${season.GAA}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						if (season.SVP !== undefined) {
							$(row).append(`<td>${season.SVP}</td>`);
						} else {
							$(row).append('<td>-</td>');
						}
						added = true;
						return false;
					}
				});
				if (!added) {
					console.log('Regular Season not found for');
					console.log(season);
				}
			});
			return $stats;
		}

		function genTable(json) {
			json = JSON.parse(json);
			const $root = $('<div class="md">');
			if (json.metadata.totalCount === 0) {
				$root.append('This player has no seasons on record');
				return $root[0];
			}
			$root.append(`<h2>${json.data[0].player.firstName} ${json.data[0].player.lastName}</h2>`);
			if (json.data[0].player.playerPosition !== 'GOALIE') {
				$root.append(getSkaterStats(json));
			} else {
				$root.append(getGoalieStats(json));
			}
			return $root[0];
		}

		return {
			type: 'GENERIC_EXPANDO',
			generate: () => genTable(data),
		};
	},
});
