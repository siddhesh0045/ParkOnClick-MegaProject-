class SlotMap {
    constructor() {
        this.slotMap = new Map();
    }

    // Methods for adding, removing, searching slots, etc.
    // ...

    // Method to add a slot with its status
    addSlot(slotNumber, status) {
        this.slotMap.set(slotNumber, status);
    }

    // Method to remove a slot by its number
    removeSlot(slotNumber) {
        this.slotMap.delete(slotNumber);
    }

    // Method to search for a slot by its number
    searchSlot(slotNumber) {
        return this.slotMap.get(slotNumber);
    }

    // Method to get all slots
    getAllSlots() {
        return Array.from(this.slotMap);
    }
}

// Create a single instance of SlotMap
const mymap = new SlotMap();

// Export the parkingMap instance to make it accessible in other files
export { mymap };
