const fs = require('fs');
const { start } = require('repl');

function parseSchedule(jsonFile, userIDs, callback) {
    let schedules = [];

    try {
        const data = fs.readFileSync(jsonFile, 'utf8');
        const schedule = JSON.parse(data);
        const specifiedUsers = schedule.users.filter(user => userIDs.includes(user.id));
        if (specifiedUsers.length === 0)
        {
            console.log("No users found for the matching ID. Please verify the userID list");
            return;
        }
                
        specifiedUsers.forEach(user => {
            schedules.push({
                id: user.id,
                name: user.name,
                busy: user.busy.map(slot => ({
                    date: slot.date,
                    start: slot.start,
                    end: slot.end
                }))
            });
        });
        return schedules;
    }
    catch (parseError)
    {
        console.error("Error parsing the JSON:", parseError);
        return [];
    }
}

function generateDateRange(startDate, endDate, blockLengthMinutes){
    let start = new Date(startDate)
    let end = new Date(endDate);
    let timeSlots = [];

    //console.log(start)

    while (start <= end){
        let endBlockTime = new Date(start.getTime() + blockLengthMinutes * 60000);

        timeSlots.push({
            start: new Date(start),
            end: new Date(endBlockTime)
        });
        start = endBlockTime;
    }

    return timeSlots
}

function findAvailableTimeBlocks(users, startDate, endDate, blockLengthMinutes) {
    const dateRange = generateDateRange(startDate, endDate, blockLengthMinutes); 
    let freeTimeSlots = dateRange; 

    
    users.forEach(user => {
        user.busy.forEach(slot => {
            const slotStart = new Date(slot.date + ' ' + slot.start); 
            const slotEnd = new Date(slot.date + ' ' + slot.end); 

            freeTimeSlots = freeTimeSlots.filter(time => {

                console.log(time.start + " " + time.end);
                console.log(slotStart + " " + slotEnd);
                console.log(!(time.start < slotStart && slotStart < time.end));
                console.log(!((time.start < slotEnd && slotEnd < time.end)));
                return !((time.start < slotStart && slotStart < time.end) || (time.start < slotEnd && slotEnd < time.end));
            });
        });
    });

    return freeTimeSlots;
}


const userIDsToCheck = ["userId1", "userId2"];


groupSchedule = parseSchedule('C:\\Users\\Shaun\\Documents\\GitHub\\Availay\\Scheduling\\Temporary Users\\U1.json', userIDsToCheck);

//console.log(groupSchedule)

timePeriod = generateDateRange("2024-01-01T00:00:00", "2024-01-07T23:59:59", 720)

//console.log(timePeriod);

test = findAvailableTimeBlocks(groupSchedule, "2024-01-01T00:00:00", "2024-01-07T23:59:59", 720);

console.log(test);
console.log(test.length);