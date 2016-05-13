'use strict';

const request = require('request');
const format = require('format');
const formatNumber = require('format-number');

const existsError = 'Sorry, I wasn\'t able to find this. Use the same ' +
                  ' name and spelling as the ARC Starmap here:' +
                  ' https://robertsspaceindustries.com/starmap';
const errorMessage = 'I wasn\'t able to get that for you. Try again later.';
const rsiSuccessError = 'There\'s an issue with the RSI site. Try again later.';

const sizeFormat = formatNumber({suffix: 'AU'});
const otherFormat = formatNumber({});

const types = {
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

function getTypeForDisplay(type) {
  if (types.hasOwnProperty(type)) {
    return types[type];
  }
  return type;
}

function getSystemMessage(system) {
  let message = '**%s** - a %s controlled by the %s.\n' +
                '*Size:* %s\n*Aggregated Population:* %s\n' +
                '*Aggregated Economy:* %s\n*Aggregated Threat:* %s' +
                '\n\n%s';
  return format(message, system.name,
                getTypeForDisplay(system.type).singular,
                system.affiliation[0].name,
                sizeFormat(system.aggregated_size),
                otherFormat(system.aggregated_population),
                otherFormat(system.aggregated_economy),
                otherFormat(system.aggregated_danger),
                system.description);
}

function getYesNoForDisplay(value) {
  if (typeof value === 'undefined' || value === null || value === '0')
  {
    return 'No';
  }
  return 'Yes';
}

function getCelestialBodyNameForDisplay(celestialObject) {
  let name = celestialObject.name;
  if (name === null) {
    return 'N/A';
  }
  return name;
}

function getCelestialBodyMessage(celestialObject, system) {
  let message = '**%s** - a %s in the %s system.\n' +
                '*Name:* %s\n*Habitable:* %s\n' +
                '*Fair Chance Act:* %s\n*Subtype:* %s' +
                '\n\n%s';
  return format(message, celestialObject.designation,
                getTypeForDisplay(celestialObject.type).singular,
                system.name,
                getCelestialBodyNameForDisplay(celestialObject),
                getYesNoForDisplay(celestialObject.habitable),
                getYesNoForDisplay(celestialObject.fairchanceact),
                celestialObject.subtype.name,
                celestialObject.description);
}

function getCelestialObject(system, celestialObjectName) {
  for (let celestialObject of system.celestial_objects) {
    if (celestialObject.designation === celestialObjectName ||
        celestialObject.code === celestialObjectName ||
        celestialObject.name === celestialObjectName) {
      return celestialObject;
    }
  }
  return undefined;
}

function getNameForDisplay(value, index, array) {
  let name = value.name;
  if (name !== null) {
    return name;
  }
  return value.designation;
}

function getListOfCelestialBodies(system) {
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
    message += format('**%s**: %s\n', getTypeForDisplay(key).plural,
                      byType[key].map(getNameForDisplay).join(', '));
  }
  return message;
}

function get(systemName, celestialObjectName, callback) {
  const url = 'https://robertsspaceindustries.com/api/starmap/star-systems/';
  let data = '';
  let req = request.post(url + systemName.toUpperCase());

  req.on('error', error => {
    callback(errorMessage);
  });

  req.on('response', response => {
    if (response.statusCode !== 200) {
      req.emit('error', new Error(errorMessage));
    }
  });

  req.on('data', body => {
    data += body;
  });

  req.on('end', () => {
    let content = JSON.parse(data);

    if (content.success !== 1) {
      req.emit('error', new Error(errorMessage));
      return;
    }

    if (content.data.rowcount === 0) {
      req.emit('error', new Error(errorMessage));
      return;
    }

    let system = content.data.resultset[0];

    let message = '';
    if (typeof celestialObjectName === 'undefined') {
      message += getSystemMessage(system);
    } else {
      let celestialObject = getCelestialObject(system, celestialObjectName);
      if (typeof celestialObject === 'undefined') {
        callback(existsError);
        return;
      }

      message += getCelestialBodyMessage(celestialObject, system);
    }

    message += getListOfCelestialBodies(system);
    callback(message);
  });
}

module.exports = get;
