function calculateDistance(pointA, pointB) {
  const earthRadius = 6371; // Radius of the Earth in kilometers

  const { latitude: lat1, longitude: lon1 } = pointA;
  const { latitude: lat2, longitude: lon2 } = pointB;

  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
}

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
    if (pointB === undefined || pointA === undefined) {
      console.log('point is undefined');
      console.log(pointB);
      console.log(pointA);
    } else {
      const distance = calculateDistance(pointA, pointB);

      waypoints.push({
        pointA,
        pointB,
        distance
      });
    }
  }

  waypoints.sort((a, b) => a.distance - b.distance);

  const selectedWaypoints = waypoints.slice(0, numWaypoints);

  return selectedWaypoints;
}

// function findWaypoints(itineraryA, itineraryB) {
//   const pointAStart = itineraryA[0];
//   const pointBStart = itineraryB[0];
//   const pointALast = itineraryA[itineraryA.length - 1];
//   const pointBLast = itineraryB[itineraryB.length - 1];

//   const closestStart = calculateDistance(pointAStart, pointBStart);
//   const closestLast = calculateDistance(pointALast, pointBLast);

//   return [
//     {
//       pointA: pointAStart,
//       pointB: pointBStart,
//       distance: closestStart
//     },
//     {
//       pointA: pointALast,
//       pointB: pointBLast,
//       distance: closestLast
//     }
//   ];
// }

module.exports = { findWaypoints, calculateDistance };