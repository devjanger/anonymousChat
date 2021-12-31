$( ()=>{

    username = $('.username').val();

    var payload = {"type": null, "uname": null, "message": null, "date": null};

    const socket = io();

    socket.on('set name', (msg)=>{
        console.log('set name 결과', msg);
    })

    $('.init_btn').on('click', ()=>{
        console.log('클릭')
        var uname = $('.init_input').val();
        
        socket.emit('set name', uname);

    });


    socket.on('chat message', (msg)=>{

        console.log("수신: ", msg);
        var {type, uname, message, date} = msg;
        
        if( type == 'chat' ){
            $('.list_box').append(
                `<ul class="chat_item">
                    <li>
                        <span class="date">${date}</span>
                        <span class="uname">${uname}</span>
                        <span class="message">${message}</span>
                    </li>
                </ul>
                `
            );
        }
        else if( type == 'change_uname' ){
            $('.list_box').append(
                `<ul class="chat_item">
                    <li>
                        <span class="date">알림! ${date}</span>
                        <span class="message">${message}</span>
                    </li>
                </ul>
                `
            );
        }
    });


    var send = ()=>{
        send_message = $('.input_box').val();
        payload["type"] = "chat";
        payload["uname"] = username;
        payload["message"] = send_message;

        socket.emit('chat message', payload);
        $('.input_box').val("");
    }

    $('.control_box .send').on( "click", ()=>{
        send();
    })

    $('.input_box').keydown( (key)=>{
        if(key.keyCode == 13)
            send();
    } )


    $('.change_uname').on("click", ()=>{
        var current_uname = username;
        var changed_uname = $('.username').val();

        username = changed_uname;

        payload["type"] = "change_uname";
        payload["uname"] = current_uname;
        payload["message"] = `${current_uname}님이 ${changed_uname}으로 닉네임을 수정했습니다.`;

        socket.emit('chat message', payload);
    })


} )

