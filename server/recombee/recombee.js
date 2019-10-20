const recombee = require('recombee-api-client');
const rqs = recombee.requests;
const clubs = require('../public/json/clubs.json');
const key = require('../public/json/key');

const client = new recombee.ApiClient(key.db, key.key);

client.send(new rqs.Batch([
    new rqs.AddItemProperty('title', 'string'),
    new rqs.AddItemProperty('url', 'string'),
    new rqs.AddItemProperty('desc', 'string'),
    new rqs.AddItemProperty('img', 'string'),
]))
.then(responses => {
    let requests = clubs.map(club => {
        return new rqs.SetItemValues(
            `${club.id}`,
            {
                'title': club.title,
                'url': club.url,
                'desc': club.desc,
                'img': club.img,
                'time': new Date().toISOString()
            },
            {
                'cascadeCreate': true
            }
        );
    });

    return client.send(new rqs.Batch(requests));
})
.then(responses => {
    const probability_visited = 0.1;
    visits = [];
    let visited = clubs.filter(() => Math.random() < probability_visited);
    visited.forEach(club => {
        visits.push(new rqs.AddPurchase(1, club.id, {'cascadeCreate': true}))
    });

    return client.send(new rqs.Batch(visits));
})
.then(responses => {
    return client.send(new rqs.RecommendItemsToItem('25833', '1', 5));
})
.then(recommended => {
    console.log(recommended);
})
.catch(error => {
    console.log(error);
})