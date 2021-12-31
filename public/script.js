$( ()=>{

    // $('.init_container').remove();

    username = null;

    var payload = {"type": null, "message": null, "date": null};

    const socket = io();


    ////// 초기 설정 화면 //////
    socket.on('check name', (msg)=>{
        if(msg['success']){
            alert(msg['message']);
            $('.enter_btn').attr('disabled', false);
        } else{
            alert(msg['message']);
            $('.enter_btn').attr('disabled', true);
        }
    })
    socket.on('set name', (msg)=>{
        if( msg['success'] ){
            console.log('채팅방 접속');
            $('.init_container').remove();
        } else {
            alert(msg['message']);
            $('.enter_btn').attr('disabled', true);
        }
    })

    $('.init_input').keydown( ()=>{
        $('.enter_btn').attr('disabled', true);
    })

    // 닉네임 존재 확인
    $('.check_btn').on('click', ()=>{
        var uname = $('.init_input').val();
        socket.emit('check name', uname);
    });

    // 입장
    $('.enter_btn').on('click', ()=>{
        var uname = $('.init_input').val();
        socket.emit('set name', uname);
        uname = uname.replaceAll('<', "&lt");
        uname = uname.replaceAll('>', "&gt");
        
        username = uname;
    });
    ///////////////////////////


    socket.on('chat message', (msg)=>{

        console.log("수신: ", msg);
        var {type, uname, message, date} = msg;
        console.log(msg);
        if( type == 'chat' ){
            $('.list_box').append(
                `
                ${ (uname == username) ? '<ul class="chat_item me">' : '<ul class="chat_item">' }
                    <li>
                        <span class="uname">${uname}</span>
                        <span class="message">${message}</span>
                        <span class="date">${date}</span>
                    </li>
                </ul>
                `
            );
        }
        else if( type == 'left' ){
            $('.list_box').append(
                `
                 <div class='alert_message'>${uname}님이 퇴장하였습니다.</div>
                `
            );           
        }
        else if( type == 'enter' ){
            $('.list_box').append(
                `
                 <div class='alert_message'>${uname}님이 접속하였습니다.</div>
                `
            );                 
        }
        else if( type == 'enter_me' ){
            $('.list_box').append(
                `
                 <div class='alert_message'>채팅방에 접속하였습니다.</div>
                `
            );                             
        }
   
        $('.list_box').scrollTop( $('.list_box')[0].scrollHeight);

    });


    var send = ()=>{
        send_message = $('.input_box').val();
        
        if( send_message == null || send_message == "" ){
            return;
        }
        payload["type"] = "chat";
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





} )

