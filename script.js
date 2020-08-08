(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')
    var submit_btn = document.getElementById('submit-btn')
    var tid_ = document.getElementById('tid')
    var receive_id_ =document.getElementById('receive-id')
    var send_ids_ = document.getElementById('send-ids')
    var is_all_yes = document.getElementById('is-all-yes')
    var is_all_no = document.getElementById('is-all-no')
    var set_olo = document.getElementById('set-olo')
    var set_olo_value = document.getElementById('set-olo-value')

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
          form.classList.add('was-validated')
        } else {
          // send_ids 输入转移olo饼干的id数个
          const send_ids = send_ids_.value.split(",");
          // receive_id设定转入olo接收站饼干id一个
          const receive_id = new Array;
          receive_id.push(receive_id_.value)
          // url 替换成需要在此帖子中进行转移的帖子id
          // 例， https://www.bilibilipy.net/t/659022?page=1 的情况下就是 659022
          const url_id = tid_.value
          // 是否转移饼干里所有剩余olo(是填写true，不是填写false)
          var is_all = is_all_yes.checked;
          // 如果上一项填写了false，reward_number可设定每次转移olo的数额
          const reward_number = Number(set_olo_value.value);
          

          // in order to store pid(receiver)
          var pid = '';
          // prepare data
          var reply_fd = new FormData();
          reply_fd.append('username', '= =');
          reply_fd.append('content', '转移接收站');
          

          // prepare url
          const reply_url = 'https://www.cpszd.com/api/create/reply/' + url_id;
          var reward_url='https://www.cpszd.com/api/comment/reward/' + url_id + '/';
          const info_url = 'https://www.cpszd.com/api/userinfo'
          


          const reply_xhr = new XMLHttpRequest();
          reply_xhr.onreadystatechange = function() {
            if (reply_xhr.readyState === 4 && reply_xhr.status === 200) {
              var responseText = reply_xhr.responseText;             
              var response_json = JSON.parse(responseText);              
              pid = response_json['data']['pid'];
              reward_url = reward_url + String(pid);
              reward();
              alert("成功")             
            }else{
              alert("错误")
            }
          }
          reply_xhr.open("POST", reply_url);
          reply_xhr.setRequestHeader("userid", receive_id);
          result = reply_xhr.send(reply_fd);

          function reward(){
            for(const id of send_ids) { 
              var tmp = reward_number;
              if (is_all == true){
                get_olo(id,function(olo_number){
                  tmp = olo_number;
                  console.log(tmp);
                  var reward_fd = new FormData();
                  reward_fd.append('gold', tmp);
                  reward_fd.append('content', '转移全部剩余olo');
                  const reward_xhr = new XMLHttpRequest();  
                  reward_xhr.open("POST", reward_url);
                  reward_xhr.setRequestHeader("userid", id)
                  reward_xhr.send(reward_fd);
                })
              }else{
                console.log(tmp)
                var reward_fd = new FormData();
                reward_fd.append('gold', tmp);
                reward_fd.append('content', '转移固定数值olo');
                const reward_xhr = new XMLHttpRequest();  
                reward_xhr.open("POST", reward_url);
                reward_xhr.setRequestHeader("userid", id)
                reward_xhr.send(reward_fd);
              }  
            }
          }

          function get_olo(id,callback){
            const olo_xhr = new XMLHttpRequest(); 
            olo_xhr.open("GET", info_url, true);
            olo_xhr.setRequestHeader("userid", id);
            olo_xhr.send();
            olo_xhr.onreadystatechange = function() {
              if (olo_xhr.readyState === 4) {
                var responseText = olo_xhr.responseText;
                var response_json = JSON.parse(responseText);
                var olo_number = response_json['data']['olo'];
                callback(olo_number);
              } else{
                alert("错误")
              }
            }
          }    
        }
      }, false)
    })

    // control display
    is_all_yes.addEventListener('click', function () {
      if(is_all_yes.checked == true){
        set_olo.style.display = "none"
      }
    }, false)
    is_all_no.addEventListener('click', function () {
      if(is_all_no.checked == true){
        set_olo.style.display = "block"
      }
    }, false) 
    
  }, false)
  

}())
