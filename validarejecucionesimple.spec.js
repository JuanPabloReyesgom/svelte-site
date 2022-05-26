/// <reference types ="Cypress" />

describe('Comparar total de ejecuciones d euna implementacion con Qlik',  ()=>{
    let token = ''
    let imprimirfechas = ''
    let comparacion = 'count'
 

   it('Obtener token y contar los resultados', ()=>{ 
      
    cy.request({

        method : 'POST',
        url : 'https://datatooling.scib.pre.corp/api/sessions',
        form: true,
        body: {"access_method":"alternative_login",
               "user":{"user_name":"qatest",
               "password":"preQAUser"}}

        }).then(response=>{

            cy.log(JSON.stringify(response));
            cy.log(response.body.token);
            token = response.body.token;
            cy.request({

                method : 'GET',
                url : 'https://datatooling.scib.pre.corp/api/rule_implementations/250',
                headers : { 'authorization' : "Bearer " + token}
            
                }).then((res)=>{

                      cy.log(JSON.stringify(res));
                      expect(res.status).to.eq(200);
                      cy.log(res.body.data.results.length); 
                     // cy.log(res.body.data.results.date);
                    let  vertice = Date.now( ) - (60*1000*60*12);                                        
                    const count = res.body.data.results.filter(result => {
                        let fecha1 = new Date(result.date);
                        return fecha1.getTime() < vertice;
                      
                    
                    }).length;
                    comparacion = count
                    cy.log(count)
                                
                }).then((comparar)=>{
                    cy.task("dbQuery", {"query": "SELECT count(*) FROM esq_td_metrics.results WHERE results_implementation_id = 250"})
                    .then(queryResponse => {
                    cy.log(queryResponse[0].count)//sacar el array a entero 
                    expect(comparacion).to.not.equal(queryResponse[0].count);
                    //expect(comparacion).not.eq(queryResponse[0].count);
                    
             
           
       })
    })
})
   })
})