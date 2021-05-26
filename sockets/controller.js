    const TicketControl = require("../models/ticket-control");

    const ticketControl = new TicketControl();

    const socketController = (socket) => {

        socket.emit('ultimo-ticket', ticketControl.ultimo)
        socket.emit('estado-actual', ticketControl.ultimos4);
        socket.emit('ticket-pendientes',ticketControl.tickets.length)


        socket.on('siguiente-ticket', ( payload, callback ) => {

           const siguiente = ticketControl.siguiente();
           callback(siguiente);


           //Notificar que hay un nuevo ticket pendiente
            socket.broadcast.emit('ticket-pendientes',ticketControl.tickets.length)
        });
        socket.on('atender-ticket', ({escritorio},callback) =>{

            if(!escritorio){
                return callback({
                    ok: false,
                    msg: 'El escritorio es obligatorio'
                });

            }
            const ticket = ticketControl.atenderTicket(escritorio);

           //Notificar Cambio en ultimo 4
            socket.broadcast.emit('estado-actual', ticketControl.ultimos4);

            socket.emit('ticket-pendientes',ticketControl.tickets.length)
            socket.broadcast.emit('ticket-pendientes',ticketControl.tickets.length)
            if(!ticket){
                callback({
                    ok: false,
                    msg: 'Ya no hay Tickets pendientes'
                });
            }else{
                callback({
                    ok: true,
                    ticket
                })
            }
        })

    }



    module.exports = {
        socketController
    }

