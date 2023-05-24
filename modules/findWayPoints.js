import { calculateDistance } from './calculateDistance.js';

function findWaypoints(itineraryA, itineraryB) {
    const polylineA = itineraryA;
    const polylineB = itineraryB;
    const numWaypoints = 2;
    const stepSize = Math.floor(polylineA.length / numWaypoints);

    const waypoints = [];

    for (let i = 0; i < numWaypoints; i++) {
        const indexA = i * stepSize;
        const indexB = i * stepSize;

        const pointA = polylineA[indexA];
        const pointB = polylineB[indexB];

        const distance = calculateDistance(pointA, pointB);

        waypoints.push({
            pointA,
            pointB,
            distance
        });
    }

    waypoints.sort((a, b) => a.distance - b.distance);

    const selectedWaypoints = waypoints.slice(0, numWaypoints);

    return selectedWaypoints;
}

module.exports = { findWaypoints };