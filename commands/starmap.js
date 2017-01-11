'use strict';

const Command = require('../command');

const request = require('request');
const format = require('format');
const formatNumber = require('format-number');

class StarmapCommand extends Command {
    constructor() {
        super({
            command: 'starmap',
            description: 'Check out the ARK Starmap!',
            hidden: false
        });
        
        this.url = 'https://robertsspaceindustries.com/api/starmap/star-systems/';

        this.sizeFormat = formatNumber({suffix: 'AU', round: 2});
        this.otherFormat = formatNumber({round: 2});
        
        this.types = {
            'SINGLE_STAR': {singular: 'single star', plural: 'Single Stars'},
            'BINARY': {singular: 'binary star', plural: 'Binary Stars'},
            'JUMPPOINT': {singular: 'jump point', plural: 'Jump Points'},
            'STAR': {singular: 'star', plural: 'Stars'},
            'PLANET': {singular: 'planet', plural: 'Planets'},
            'SATELLITE': {singular: 'satellite', plural: 'Satellites'},
            'ASTEROID_BELT': {singular: 'asteroid belt', plural: 'Asteroid Belts'},
            'ASTEROID_FIELD': {singular: 'asteroid field', plural: 'Asteroid Fields'},
            'BLACKHOLE': {singular: 'blackhole', plural: 'Blackholes'},
            'POI': {singular: 'point of interest', plural: 'Points of Interest'},
            'MANMADE': {singular: 'manmade object', plural: 'Manmade Objects'}
        };
    }
    
    getTypeForDisplay(type) {
        if (this.types.hasOwnProperty(type)) {
            return this.types[type];
        }
        return type;
    }

    getSystemMessage(system) {
        let message = '**%s** - a %s controlled by the %s.\n' +
                      '*Size:* %s\n*Aggregated Population:* %s\n' +
                      '*Aggregated Economy:* %s\n*Aggregated Threat:* %s' +
                      '\n\n%s';
        return format(message, system.name,
                      this.getTypeForDisplay(system.type).singular,
                      system.affiliation[0].name,
                      this.sizeFormat(system.aggregated_size),
                      this.otherFormat(system.aggregated_population),
                      this.otherFormat(system.aggregated_economy),
                      this.otherFormat(system.aggregated_danger),
                      system.description);
    }

    getYesNoForDisplay(value) {
        if (typeof value === 'undefined' || value === null || value === '0')
        {
            return 'No';
        }
        return 'Yes';
    }

    getCelestialBodyNameForDisplay(celestialObject) {
        let name = celestialObject.name;
        if (name === null) {
            return 'N/A';
        }
        return name;
    }

    getCelestialBodyMessage(celestialObject, system) {
    let message = '**%s** - a %s in the %s system.\n' +
                    '*Name:* %s\n*Habitable:* %s\n' +
                    '*Fair Chance Act:* %s\n*Subtype:* %s' +
                    '\n\n%s';
    return format(message, celestialObject.designation,
                    this.getTypeForDisplay(celestialObject.type).singular,
                    system.name,
                    this.getCelestialBodyNameForDisplay(celestialObject),
                    this.getYesNoForDisplay(celestialObject.habitable),
                    this.getYesNoForDisplay(celestialObject.fairchanceact),
                    celestialObject.subtype.name,
                    celestialObject.description);
    }

    getCelestialObject(system, celestialObjectName) {
        for (let celestialObject of system.celestial_objects) {
            if (celestialObject.designation === celestialObjectName ||
                    celestialObject.code === celestialObjectName ||
                    celestialObject.name === celestialObjectName) {
                return celestialObject;
            }
        }
        return undefined;
    }

    getNameForDisplay(value, index, array) {
        let name = value.name;
        if (name !== null) {
            return name;
        }
        return value.designation;
    }

    getListOfCelestialBodies(system) {
        let byType = {};
        for (let celestialObject of system.celestial_objects) {
            let type = celestialObject.type;

            if (byType.hasOwnProperty(type)) {
                byType[type].push(celestialObject);
            } else {
                byType[type] = [celestialObject];
            }
        }

        let message = format('\n\nAlso in  the %s system:\n', system.name);
        for (let key of Object.keys(byType)) {
            message += format('**%s**: %s\n', this.getTypeForDisplay(key).plural,
                              byType[key].map(this.getNameForDisplay).join(', '));
        }
        return message;
    }

    fetch(systemName, celestialObjectName) {
        return new Promise((resolve, reject) => {
            let data = '';
            let req = request.post(this.url + systemName.toUpperCase());

            req.on('error', error => {
                reject(error);
            });

            req.on('response', response => {
                if (response.statusCode !== 200) {
                    req.emit('error', new Error('Response Code was not 200.'));
                }
            });

            req.on('data', body => {
                data += body;
            });

            req.on('end', () => {
                let content = JSON.parse(data);

                if (content.success !== 1) {
                    req.emit('error', new Error('There was an error in the response from RSI.'));
                    return;
                }

                if (content.data.rowcount === 0) {
                    req.emit('error', new Error('Sorry, I wasn\'t able to find this. Use the same ' +
                                                ' name and spelling as the ARC Starmap here:' +
                                                ' <https://robertsspaceindustries.com/starmap>'));
                    return;
                }

                let system = content.data.resultset[0];

                let message = '';
                // We have an optional argument, celestialObjectName, that allows the results
                // to be more specific, we need to check if it exists before we continue.
                if (!celestialObjectName) {
                    message += this.getSystemMessage(system);
                } else {
                    let celestialObject = this.getCelestialObject(system, celestialObjectName);

                    if (typeof celestialObject === 'undefined') {
                        reject('Sorry, I wasn\'t able to find this. Use the same ' +
                            ' name and spelling as the ARC Starmap here:' +
                            ' <https://robertsspaceindustries.com/starmap>');
                        return;
                    }

                    message += this.getCelestialBodyMessage(celestialObject, system);
                }

                message += this.getListOfCelestialBodies(system);
                resolve(message);
            });
        });
    }

    respond(message, bot, config, resolve, reject) {
        let messageContents = this.stripMessage(message, config);
        
        if (!messageContents) {
            // If we haven't been passed anything.
            resolve('You can check out the ARK Starmap at: ' +
                    '<https://robertsspaceindustries.com/starmap>');
            return;
        }
        
        let args = messageContents.split(' ');
        let systemName = args[0];
        let celestialObjectName = args.slice(1).join(' ');
        
        this.fetch(systemName, celestialObjectName).then((response) => {
            resolve(response);
        }, (error) => {
            reject(error);
        });
    }
}

module.exports = [StarmapCommand];
