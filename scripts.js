/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
    let url = 'http://127.0.0.1:7000/consultas';
    fetch(url, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        
        data.consultas_pacientes.forEach(
          item => insertList(item.nome, item.sobrenome, 
                            item.cpf, item.data_nascimento, item.data_consulta, item.horario_consulta, item.plano_saude))
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  /*
    --------------------------------------------------------------------------------------
    Função para colocar um item na lista do servidor via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postItem = async (inputNome, inputSobrenome,inputCPF, inputDataNascimento, inputDataConsulta, inputHorarioConsulta, inputPlanoSaude) => {
    const formData = new FormData();
    formData.append('nome', inputNome);
    formData.append('sobrenome', inputSobrenome);
    formData.append('cpf', inputCPF);
    formData.append('data_nascimento', inputDataNascimento);
    formData.append('data_consulta', inputDataConsulta);
    formData.append('horario_consulta', inputHorarioConsulta);
    formData.append('plano_saude', inputPlanoSaude);
  
    let url = 'http://127.0.0.1:7000/agendar_consulta';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
    })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  
  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão close para cada item da lista
    --------------------------------------------------------------------------------------
  */
  const insertButton = (parent) => {
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    parent.appendChild(span);
  }

  /*
    --------------------------------------------------------------------------------------
    Função de máscara para CPF
    --------------------------------------------------------------------------------------
  */
    const maskCPF = document.getElementById("newCPF");

      maskCPF.addEventListener('keypress', () => {
          let inputlenght = maskCPF.value.length

          if(inputlenght === 3 || inputlenght === 7) {
            maskCPF.value += '.'
          }
          else if(inputlenght === 11){
            maskCPF.value += '-'
          }

      })
    
  /*
    --------------------------------------------------------------------------------------
    Função de máscara para Data de Nascimento
    --------------------------------------------------------------------------------------
  */
    const maskDataNascimento = document.getElementById("newDataNascimento");

    maskDataNascimento.addEventListener('keypress', () => {
          let inputlenght = maskDataNascimento.value.length

          if(inputlenght === 2 || inputlenght === 5) {
            maskDataNascimento.value += '/'
          }
      })
      
  /*
    --------------------------------------------------------------------------------------
    Função para validar CPF
    --------------------------------------------------------------------------------------
  */

    function TestaCPF(strCPF) {
          strCPF = strCPF.replace(/\D/g,"")
          var Soma;
          var Resto;
          Soma = 0;
        if (strCPF == "00000000000") return false;
      
        for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;
      
          if ((Resto == 10) || (Resto == 11))  Resto = 0;
          if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
      
        Soma = 0;
          for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
          Resto = (Soma * 10) % 11;
      
          if ((Resto == 10) || (Resto == 11))  Resto = 0;
          if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;

          return true;
      }

      // var strCPF = "12345678909";
      // alert(TestaCPF(strCPF));
  
  /*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */
  const removeElement = () => {
    let close = document.getElementsByClassName("close");
    // var table = document.getElementById('myTable');
    let i;
    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        let div = this.parentElement.parentElement;
        const horarioDeletado = div.getElementsByTagName('td')[5].innerHTML
        const dataDeletada = div.getElementsByTagName('td')[4].innerHTML
        if (confirm("Deseja mesmo desmarcar esta consulta?")) {
          div.remove()
          deletaConsulta(horarioDeletado, dataDeletada)
          alert("Consulta desmarcada com sucesso!")
        }
      }
    }
  }
    
  /*
    --------------------------------------------------------------------------------------
    Função para deletar um paciente da lista do servidor via requisição DELETE
    --------------------------------------------------------------------------------------
  */
    const deletaConsulta = (horarioDeletado, dataDeletada) => {
      console.log(horarioDeletado, dataDeletada)
      let url = 'http://127.0.0.1:7000/desmarcar_consulta?horario=' + horarioDeletado + '&data=' + dataDeletada;
      // let url = 'http://127.0.0.1:7000/consultas?horario=' + horarioDeletado + '&data=' + dataDeletada;
      fetch(url, {
        method: 'delete'
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
        });
    }

  /*
    --------------------------------------------------------------------------------------
    Função para adicionar
    --------------------------------------------------------------------------------------
  */
  const newItem = () => {
    let inputNome = document.getElementById("newNome").value;
    let inputSobrenome = document.getElementById("newSobrenome").value;
    let inputCPF = document.getElementById("newCPF").value;
    let inputDataNascimento = document.getElementById("newDataNascimento").value;
    let inputDataConsulta = document.getElementById("newDataConsulta").value;
    let inputHorarioConsulta = document.getElementById("newHorarioConsulta").value;
    let inputPlanoSaude = document.getElementById("newPlanoSaude").value;
  
    if (inputNome === '' || inputSobrenome === '' || inputCPF === ''|| inputDataNascimento === '' || inputDataConsulta === '' || inputHorarioConsulta === '') {
      alert("Todas as informações requisitadas devem ser preenchidas.");
    } else if (TestaCPF(inputCPF) == false){   
      alert("O CPF informado é inválido.");
    } else {

      insertList(inputNome, inputSobrenome, inputCPF, inputDataNascimento, inputDataConsulta, inputHorarioConsulta, inputPlanoSaude)
      postItem(inputNome, inputSobrenome, inputCPF, inputDataNascimento, inputDataConsulta, inputHorarioConsulta, inputPlanoSaude)
    }

    
      // insertList(inputNome, inputSobrenome, inputCPF, inputDataNascimento, inputDataConsulta, inputHorarioConsulta)
      // alert("Consulta agendada com sucesso!")
  
  }

  /*
    --------------------------------------------------------------------------------------
    Função para traduzir o valor de plano de saúde (que no banco consta com "true" ou "false") para português
    --------------------------------------------------------------------------------------
  */

  function traduzir (PlanoSaude) {
    let db_PS = "Não";
    if(PlanoSaude == true){
      db_PS = "Sim";
    }
    return db_PS;
  }

  
  /*
    --------------------------------------------------------------------------------------
    Função para inserir items na lista apresentada
    --------------------------------------------------------------------------------------
  */

  const insertList = (pacienteNome, pacienteSobrenome, pacienteCPF, pacienteDataNascimento, pacienteDataConsulta, pacienteHorarioConsulta, pacientePlanoSaude) => {
    var psPortugues = traduzir(pacientePlanoSaude);
    // var pDN = formatarData(pacienteDataNascimento);
    // var pDC = formatarData(pacienteDataConsulta);
    var item = [pacienteNome, pacienteSobrenome, pacienteCPF, pacienteDataNascimento, pacienteDataConsulta, pacienteHorarioConsulta, psPortugues]
    var table = document.getElementById('myTable');
    var row = table.insertRow();

    

    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
    insertButton(row.insertCell(-1))

    // Esvazia os campos de preenchimento
    document.getElementById("newNome").value = "";
    document.getElementById("newSobrenome").value = "";
    document.getElementById("newCPF").value = "";
    document.getElementById("newDataNascimento").value = "";
    document.getElementById("newDataConsulta").value = "";
    document.getElementById("newHorarioConsulta").value = "";
    document.getElementById("newPlanoSaude").value = "";
  
    removeElement()
  }



