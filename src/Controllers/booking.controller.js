import { Booking } from "../Models/booking.model";
import { Service } from "../Models/service.model";
import { ApiError } from "../Utils/apiError";
import { asyncHandler } from "../Utils/AsyncHandler";

export const BookService = asyncHandler(async (req,res)=>{
    const {decoratorId, serviceId, eventDate, eventLocation, bookingNotes} = req.body
    
    if([decoratorId, serviceId, eventDate, eventLocation, bookingNotes].some((e)=> !e)){
        throw new ApiError(400, 'all fields are required')
    }

    const customer = req.user
    if(!customer){
        throw new ApiError(400, 'customer must be logged in to book a service')
    }

    const service = await Service.findById(serviceId)
    if(!service){
        throw new ApiError(404, 'service not found to book')
    }

    Booking.create({
        customer, decoratorId
    })

})