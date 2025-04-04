import requests from './requests.json'
import rooms from './rooms.json'
import reservations from './reservations.json'


interface Request{
  smoking_room: boolean
  checkIn_date: string
  checkOut_date: string
}

interface Room {
  room_id: string
  smoking_room: boolean
  price: number
}

interface Reservation {
  room_id: string
  checkIn_date: string
  checkOut_date: string
  nights: number
}

// Check if the room is available for the requested dates
function checkAvailability(room_id: string, checkIn_date: string, checkOut_date: string): boolean {
  const room = reservations.filter((reservation) => {
    return reservation.room_id === room_id &&
      (
        (
          new Date(checkIn_date) > new Date(reservation.checkIn_date) &&
          new Date(checkIn_date) <= new Date(reservation.checkOut_date)
        )
          ||
        (
          new Date(checkOut_date) >= new Date(reservation.checkIn_date) &&
          new Date(checkOut_date) < new Date(reservation.checkOut_date)
        )
      )
  })  

  return room.length>0 ? false:true
}

function main() {  
  for (const request of requests) {  
    // Select required rooms by requirements
    const requiredRooms: Room[] = rooms.filter((room) => 
      room.smoking_room === request.smoking_room
    ) 
  
    const availableRooms: Room[] = []
  
    for (const room of requiredRooms) {
      const room_id = room.room_id
      const checkIn_date = request.checkIn_date
      const checkOut_date = request.checkOut_date
  
      const available = checkAvailability(room_id, checkIn_date, checkOut_date)
  
      if (available) availableRooms.push(room)
    }
  
    // If no rooms are available, throw an error
    if (availableRooms.length === 0) throw new Error("There are no available rooms")
  
    let selectedRoom: Room | null = null
    const price = +Infinity 
  
    // Find the room with the lowest price among the available rooms
    for (const room of availableRooms) {
      if (room.price < price) {
        selectedRoom = room
        price = room.price
      }
    }
  
    // If no room is selected, throw an error
    if (!selectedRoom) throw new Error("No room was selected")
  
    // Create a new reservation with the selected room and requested dates
    const reservation: Reservation = {
      room_id: selectedRoom.room_id,
      checkIn_date: request.checkIn_date,
      checkOut_date: request.checkOut_date,
      nights: Math.ceil(
        (new Date(request.checkOut_date).getTime() - new Date(request.checkIn_date).getTime()) /
        (1000 * 60 * 60 * 24)
      )
    }
  
    // Add the new reservation to the list of reservations
    reservations.push(reservation)
  
    console.log(reservation) 
  }
}

main()
