export default class VolumeManager {
    constructor(volumeWindow) {
        // Ensure a minimum volume window
        this.volumeWindow = volumeWindow < 1 ? 1600 : volumeWindow;
        // Initialize with a default value
        this.volumeHistory = [0];
        // Sliding window technique to track the total sum of volume by subtracting the oldest
        // value when popping and adding the newest value when pushing new volume. This way 
        // we can calculate the total volume in O(1) compared to O(n) where we before would have
        // to iterate through our entire volumeHistory with every calcuation.
        this.currentVolumeSum = 0;
    }

    recordVolume(amount) {
        // Add validation for amount
        if (amount == null || isNaN(amount) || amount <= 0) {
            console.error("Invalid volume amount:", amount);
            return 1;  // Return an error indicator
        }

        console.log("Pushing with an amount of", amount);

        // Push the amount
        this.volumeHistory.push(amount);
        this.currentVolumeSum += amount;

        // Trim the array if it exceeds the volume window and subract trail sum from currentVolume
        if (this.volumeHistory.length > this.volumeWindow) {
            this.currentVolumeSum -= this.volumeHistory.shift();
        }

        console.log("Push finished");
        return 0;  // Successful push
    }


    calculateMovingAverage() {
        if (this.volumeHistory.length === 0) {
            console.log("No volume data available.");
            return 1;
        }

        return this.currentVolumeSum / this.volumeHistory.length;
    }
}