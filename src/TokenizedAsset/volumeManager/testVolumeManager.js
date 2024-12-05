export default class TestVolumeManager {
    constructor() {
        this.volumeWindow = 5000;
        this.volumeHistory = [];
    }
    recordVolume() {
        let amount = Math.random();
        console.log(`Pushing with an amount of ${amount}`);
        this.volumeHistory.push(amount);
        console.log(`Push finished`);
    }
}