import React, {useState, useContext, useEffect} from "react"
import {Button, Image, Form, CloseButton, FormGroup} from "react-bootstrap"
import np from "../assets/nova_poshta.png"
import up from "../assets/ukrposhta.png"
import justin from "../assets/justin.png"
import axios from "axios"
import {observer} from "mobx-react-lite"
import {Context} from ".."
import InputMask from "react-input-mask"
import {editBuyer, createBuyer} from "../http/userAPI"

const CustomerData = observer(({bool}) => {
  const {store} = useContext(Context)
  const [lcl, setLcl] = useState(bool)
  const [npFin, setNpFin] = useState(bool)

  const [zip, setZip] = useState("")
  const [dep, setDep] = useState("")
  const [lc, setLc] = useState("")
  const [local, setLocal] = useState("")
  const [locals, setLocals] = useState([])
  const [vis, setVis] = useState(false)
  const [npVis, setNpVis] = useState(false)
  const [upVis, setUpVis] = useState(false)
  const [city, setCity] = useState("")
  const [num, setNum] = useState("")
  const [ref, setRef] = useState("")
  const [depart, setDepart] = useState("")
  const [departs, setDeparts] = useState([])
  const [vib, setVib] = useState(false)
  const [tel, setTel] = useState(false)
  const [com, setCom] = useState(false)

  useEffect(() => 
    axios.post(`https://api.novaposhta.ua/v2.0/json/Address/searchSettlements/`, {
      "apiKey": "69632745cbe138ad8b3fd7a0d81ea5f6",
      "modelName": "Address",
      "calledMethod": "searchSettlements",
      "methodProperties": {
          "CityName": local,
          "Limit": 500
      }
    }).then(res => setLocals(res.data.data[0].Addresses)), [local]
  )
  useEffect(() => 
    axios.post(`https://api.novaposhta.ua/v2.0/json/Address/getCities`, {
      "apiKey": "69632745cbe138ad8b3fd7a0d81ea5f6",
      "modelName": "Address",
      "calledMethod": "getCities",
      "methodProperties": {
          "Ref": ref
      }
    }).then(res => setCity(res.data.data[0])), [ref]
  )
  useEffect(() => 
    axios.post(`https://api.novaposhta.ua/v2.0/json/AddressGeneral/getWarehouses`, {
      "apiKey": "69632745cbe138ad8b3fd7a0d81ea5f6",
      "modelName": "Address",
      "calledMethod": "getWarehouses",
      "methodProperties": {
        "CityRef": ref,
        "FindByString": depart,
        "WarehouseId": num,
        "Limit": 500
      }
    }).then(res => setDeparts(res.data.data)), [depart, num, ref]
  )
 
  return (
    <div style={{border: "1px solid lightgray", borderTop: "solid white"}}> 
      <h4 className="mt-1 d-flex justify-content-center">???????????????????? ????????????</h4>
      <Form>
        <Form.Group className="p-2">
          <Form.Label>??????????????, ??????, ????????????????</Form.Label>
          <Form.Control
            value={store.buyer.name}
            style={{border: "1px solid gray"}}
            onChange={event => store.setBuyer({...store.buyer, ...{name: event.target.value}})}
          />	
        </Form.Group>
        <div className="p-2 d-flex flex-column">
          <>???????????????????? ??????????</>
          {!lcl &&
            <Form.Control
              value={lc} style={{border: "1px solid gray", marginTop: 5}}
              placeholder={"?????????????? ????????????????, ???????????????? ???? ????????????."}
              onFocus={() => {
                store.setBuyer({...store.buyer, ...{service: ""}})
                setLc("")
                setDeparts([]) 
                setVis(false)
                setNpVis(false)
              }}
              onChange={event => {
                setLc(event.target.value)
                setLocal(lc.replace(/[^??-????-??]/g, ""))
              }}
            />
          }	
          </div>
          {lcl &&
            <div className="p-2" style={{marginTop: -8}}> 
              <div className="p-2 ml-2 d-flex flex-column" style={{border: "1px solid gray", borderRadius: 5, fontSize: 16}}>
                <span className="d-flex justify-content-between">
                  {store.buyer.localRus}
                  <CloseButton 
                    style={{width: 1, marginLeft:"auto", marginTop: -10}} 
                    onClick={() => {
                      store.setBuyer({...store.buyer, ...{service: ""}})
                      setLcl(false)
                      setLc("")
                      setNpVis(false)
                      setVis(false)
                      setNpFin(false)
                      setUpVis(false)
                    }} 
                  />
                </span><br/>
                <span style={{marginTop: -25}}>({store.buyer.localUkr})</span>
              </div>
            </div>
          }
          <div className="d-flex flex-column" style={{position: "absolute", left: 50, maxHeight: 300, 
            zIndex: 1, overflow: "auto", background: "white", border: "1px solid gray", borderRadius: 5}}>
            {locals.map((loc, index) => 
              <Button className="d-flex align-items-center" style={{border: "none", height: 22}}
                key={index} variant="outline-primary" size="sm"
                onMouseOver={() => setRef(loc.DeliveryCity)}
                onClick={()=> {
                  store.setBuyer({...store.buyer, ...{localRus: city.SettlementTypeDescriptionRu + " " + city.DescriptionRu + ", " + city.AreaDescriptionRu + " ??????????????."}})
                  store.setBuyer({...store.buyer, ...{localUkr: loc.Present}})
                  setVis(true)
                  setLcl(true)
                  setLocals([])
                }}
              >{loc.Present}</Button>
            )}
          </div>
          <div className="p-2 d-flex flex-column">
            <>????????????????</>
            {vis && <div className="d-flex justify-content-between align-items-center">
              <Button variant="outline-info" style={{border: "none"}}
                onClick={() => {
                  store.setBuyer({...store.buyer, ...{service: "?????????? ??????????"}})
                  setNpVis(true)
                  setVis(false)
                }}
              >
                <Image src={np} width={60} />
              </Button>
              <Button variant="outline-info" style={{border: "none"}}
                onClick={() => {
                  store.setBuyer({...store.buyer, ...{service: "????????????????"}})
                  setUpVis(true)
                  setVis(false)
                  setZip("")
                  setDep("")
                }}
              >
                <Image src={up} width={80} />
              </Button>
              <Button variant="outline-info" style={{border: "none"}}
                onClick={() => {
                  store.setBuyer({...store.buyer, ...{service: "Justin"}})
                  setUpVis(true)
                  setVis(false)
                  setZip("")
                  setDep("")
                }}
              >
                <Image src={justin} width={60} />
              </Button><>??????</>
              <Form.Control
                placeholder={"???????? ??????????????"} style={{border: "1px solid gray", marginLeft: 5}}
                value={store.buyer.service}
                onChange={event => store.setBuyer({...store.buyer, ...{service: event.target.value}})}
              />
              <Button variant="outline-primary" style={{border: "1px solid gray", marginLeft: 3}}
                onClick={() => {
                  setUpVis(true)
                  setVis(false)
                  setZip("")
                  setDep("")
                }}
              >????????????</Button>	
            </div>
          }
          {upVis &&
            <div className="mt-2 d-flex flex-column">
              <Image src={store.buyer.service === "????????????????" ? up : store.buyer.service === "Justin" ? justin : null} width={120} />
              {!(store.buyer.service === "????????????????" || store.buyer.service === "?????????? ??????????" || store.buyer.service === "Justin") && 
                <div style={{fontWeight: "bold"}}>{store.buyer.service.slice(0, 1).toUpperCase() + store.buyer.service.slice(1)}</div>
              }
              <div className="mt-2 d-flex justify-content-between align-items-end">
                <FormGroup style={{width: "20%"}}>
                  <Form.Label>{store.buyer.service === "????????????????" ? "????????????" : "??? ??????????????????"}</Form.Label>
                  <Form.Control
                    value={zip} style={{border: "1px solid gray"}}
                    onChange={event => setZip(event.target.value.replace(/[^0-9]/g, ""))}
                  />	
                </FormGroup>
                <FormGroup style={{width: "65%"}}>
                  <Form.Label style={{marginLeft: 5}}>?????????? ??????????????????(??????????, ???)</Form.Label>
                  <Form.Control
                    value={dep} style={{border: "1px solid gray"}}
                    onChange={event => setDep(event.target.value)}
                  />
                </FormGroup>
                <Button variant="outline-primary" style={{border: "1px solid gray"}}
                  onClick={() => {
                    store.setBuyer({...store.buyer, ...{departRus: store.buyer.service === "????????????????" ? "????????????: " + zip + ". ??????????: " + 
                    dep.slice(0, 1).toUpperCase() + dep.slice(1) + "." : "??????????????????: " + zip + ". ??????????: " + dep.slice(0, 1).toUpperCase() + dep.slice(1)}})
                    setUpVis(false)
                    setNpFin(true)
                  }}
                >????????????</Button>		
              </div>
            </div>
          }
          {npVis &&
            <div className="mt-2 d-flex flex-column">
              <div className="d-flex align-items-center">
                <Image src={np} width={120} />
                <div style={{marginLeft: 20, fontSize: 16}}>?????? ???????????? ?????????????? ?????????? ?????? ?????????? ?????????????????? (??????????????????) </div>
              </div>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <FormGroup style={{width: "20%"}}>
                  <Form.Label>??? ??????????????????</Form.Label>
                  <Form.Control
                    value={num} style={{border: "1px solid gray"}}
                    onFocus={() => setDepart("")}
                    onChange={event => setNum(event.target.value.replace(/[^0-9]/g, ""))}
                  />
                </FormGroup>
                <FormGroup style={{width: "78%"}}>
                  <Form.Label style={{marginLeft: 5}}>?????????? ??????????????????(?????????? ?????????????? ???????????)</Form.Label>
                  <Form.Control 
                    value={depart} style={{border: "1px solid gray"}}
                    onFocus={() => setNum("")} 
                    onChange={event => setDepart(event.target.value)}
                  />	
                </FormGroup>
              </div>
              <div className="d-flex flex-column" style={{position: "absolute", left: 50, top: 684, maxHeight: 275, zIndex: 1,
                overflow: "auto", background: "white", border: "1px solid gray", borderRadius: 5}}
              >
                {departs.map((dep, index) => 
                  <Button className="d-flex align-items-center" style={{border: "none", height: 22}}
                    key={index} variant="outline-primary" size="sm"
                    onClick={()=>{
                      store.setBuyer({...store.buyer, ...{departRus:dep.DescriptionRu}})
                      setNpVis(false)
                      setNpFin(true)
                      setDepart("")
                      setNum("")
                    }}
                  >{dep.DescriptionRu}</Button>
                )}
              </div>  
            </div>
          }
          {npFin && 
            <div> 
              <Image src={store.buyer.service === "????????????????" ? up : store.buyer.service === "Justin" ? justin : store.buyer.service === "?????????? ??????????" ? np : null} width={120} className="mt-2" />
              {!(store.buyer.service === "????????????????" || store.buyer.service === "?????????? ??????????" || store.buyer.service === "Justin") && store.buyer.service &&
                <div style={{fontWeight: "bold", marginTop: -20}}>{store.buyer.service.slice(0, 1).toUpperCase() + store.buyer.service.slice(1)}</div>
              }
              {store.buyer.service === "" && <div style={{fontWeight: "bold", marginTop: -20}}>???? ?????????????? ???????????? ????????????????</div>}
              <div className="p-2 ml-2 mt-2 " style={{border: "1px solid gray", borderRadius: 5, fontSize: 16}}>
                <span className="d-flex justify-content-between">
                  {store.buyer.departRus}
                  <CloseButton style={{width: 1, marginLeft:"auto", marginTop: -10}} 
                    onClick={() => {
                      store.setBuyer({...store.buyer, ...{service: ""}})
                      setNpFin(false)
                      setVis(true)
                    }} 
                  />
                </span>
              </div>
            </div> 
          }
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <>?????????????? 
              <Button variant="outline-primary" style={{border: "none", fontSize: 20}} onClick={() => setVib(true)}>viber</Button>
              <Button variant="outline-primary" style={{border: "none", fontSize: 20}} onClick={() => setTel(true)}>telegram</Button> 
            </>
            <div style={{width: "60%"}}>
              <InputMask 
                mask="+38 (099) 999-99-99" 
                value={store.buyer.phone}
                onChange={event => store.setBuyer({...store.buyer, ...{phone: event.target.value}})}
              />
            </div>
          </div>
          {vib && 
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <>Viber<CloseButton style={{width: 1, marginRight: "27%"}} onClick={() => setVib(false)} /></>
              <Form.Control
                value={store.buyer.viber} style={{width: "60%", border: "1px solid gray"}}
                onChange={event => store.setBuyer({...store.buyer, ...{viber: event.target.value}})}
              />	
            </div>
          }
          {tel && 
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <>Telegram<CloseButton style={{width: 1, marginRight: "22%"}} onClick={() => setTel(false)} /></>
              <Form.Control
                value={store.buyer.telegram} style={{width: "60%", border: "1px solid gray"}}
                onChange={event => store.setBuyer({...store.buyer, ...{telegram: event.target.value}})}
              />	
            </div>
          }
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <>?????????????????????? ??????????</>
            <Form.Control
              value={store.buyer.email} style={{width: "60%", border: "1px solid gray"}}
              onChange={event => store.setBuyer({...store.buyer, ...{email: event.target.value}})}
            />	
          </div>
          <div className="mt-3 d-flex justify-content-between align-items-center">
            <>????????????</>
            <Form.Select 
              value={store.buyer.pay} style={{width: "60%", border: "1px solid gray", fontSize: 18}}
              onChange={event => store.setBuyer({...store.buyer, ...{pay: event.target.value}})}
            >
              <option value="?????????????????? ????????????????????">?????????????????? ????????????????????</option>
              <option value="???????????? ????????????????????">???????????? ????????????????????</option>
            </Form.Select>
          </div>
        </div>
        {!com &&
          <Button variant="outline-primary" style={{border: "none", fontSize: 20}}
            onClick={() => setCom(true)}
          >???????????????? ?????????????????????? ?? ????????????</Button>
        }
        {com &&
          <div className="p-2 d-flex justify-content-between">
            <>??????????????????????<CloseButton style={{width: 1}} onClick={() => setCom(false)} /></>  
            <Form.Control
              as="textarea" style={{width: "75%", height: 100, border: "1px solid gray"}}
              value={store.buyer.comment || ""}
              onChange={event => store.setBuyer({...store.buyer, ...{comment: event.target.value}})}
            />	
          </div>
        }
        <div className="p-2 d-flex justify-content-end">
          {bool ?
            <Button
              // type="submit" 
              variant="outline-primary" size="lg"
              onClick={() => editBuyer(store.buyer.id, {name: store.buyer.name, localUkr: store.buyer.localUkr, localRus: store.buyer.localRus, service: store.buyer.service, 
                departRus: store.buyer.departRus, phone: store.buyer.phone, viber: store.buyer.viber, telegram: store.buyer.telegram, email: store.buyer.email, pay: store.buyer.pay, 
                comment: store.buyer.comment}).then(data => store.setBuyer(data)).then(console.log(store.buyer))
              } 
            >?????????????????? ??????????????????</Button>
            :

            <Button
              // type="submit" 
              variant="outline-primary" size="lg"
              onClick={async () => {
                try {
                  await createBuyer({name: store.buyer.name, localUkr: store.buyer.localUkr, localRus: store.buyer.localRus, service: store.buyer.service, 
                    departRus: store.buyer.departRus, phone: store.buyer.phone, viber: store.buyer.viber, telegram: store.buyer.telegram, email: store.buyer.email, pay: store.buyer.pay, 
                    comment: store.buyer.comment}).then(data => store.setBuyer(data)).then(console.log(store.buyer))
                } catch (err) {
                  alert(err.response.data.message)
                }
              }} 
            >???????????????? ??????????</Button>
          }
        </div>
      </Form>
    </div>
  )
})

export default CustomerData