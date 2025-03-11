"use client"; 
import $ from "jquery"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { faCircleHalfStroke, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {FaDesktop, FaUser, FaUpload, FaSave, FaBars, FaArrowLeft, FaImages, FaMobile, FaTablet, FaTimes, FaPlus} from "react-icons/fa";

export default function Home() {     
  const [containers, setContainers] = useState({
    A: [{ id: "A", content: "Div A", isDraggable: true }],
    B: [{ id: "B", content: "Div B", isDraggable: true }],
  });
  
  const [key, setKey] = useState(0);

  const handleDragEnd = (result) => {
    if (!result.destination) return; 
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...containers[source.droppableId]];
      const destItems = [...containers[destination.droppableId]];

      // Move item from source to destination
      const [movedItem] = sourceItems.splice(source.index, 1);
      movedItem.isDraggable = false;  

      destItems.push(movedItem);

      setContainers({
        ...containers,
        [source.droppableId]: sourceItems,
        [destination.droppableId]: destItems,
      });
    }
    
  };
  const handleDragOver  = (result) => {
    if (result.destination != null && (result.destination.droppableId == "B" || result.destination.droppableId == "A")){
      
    }
  };
    
  useEffect(() => {
    setKey((prev) => prev + 1);

}, []);

  return (   
    <div className="min-h-screen bg-gray-100 p-6" id="cer_cont"> 
    <input type="hidden" id="hndBoxId" name="hndBoxId" value=""></input>
    <input type="hidden" id="hndIsMdl" name="hndIsMdl" value=""></input>
      <div class="content" id="cer_cont1">                  
          <div className="grid grid-cols-3" >
            <div className="flex items-center justify-center " style={{height: "3rem"}}>
              <button style={{fontSize:"14px", borderRadius: "7px"}} className="absolute left-4 bg-black text-white p-2">
                <FaArrowLeft></FaArrowLeft>
              </button>
            </div>
            <div className="flex items-center justify-center" style={{height: "3rem"}}>
              <div className="fa-save"><FaSave style={{marginLeft:"3px"}}></FaSave></div>  
              <div className="dlpad" style={{marginRight:"10px"}}>Digital Launch Pad</div>          
              <div className="fa-save" style={{marginRight:"10px"}}><FaBars style={{marginLeft:"3px"}}></FaBars></div>  
            </div>
            <div className="flex items-center justify-center " style={{height: "3rem"}}>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md absolute" style={{width:"108px", right:"20px"}}><FaUpload style={{ marginLeft: "-11px"}}></FaUpload><p style={{margin: "-19px -17px 0px 0px"}}>Publish</p> </button>            
            </div>
          </div>  
          <div className="w-1/2 mx-auto bg-blue-500 p-4 text-white mt-6 bg-white p-6 rounded-lg shadow-md relative scroll" >
            {/* Icon in Top Left */}
            <button style={{ fontSize:"14px", borderRadius: "10px;", marginTop:"-10px", width:"40px", height:"40px"}} className="absolute left-4 bg-black text-white p-2">
              <FaUser style={{fontSize:"20px",marginLeft:"2px"}}></FaUser>
            </button>

            {/* Grid Layout */}                        
            <div className="grid grid-cols-6  MdlDropTarget"  style={{ margin:"95px", marginLeft:"150px"}}>
              <DragDropContext onDragEnd={handleDragEnd} onDragUpdate={handleDragOver}>  
                  <div className="grid grid-rows-2 gap-4"  style={{paddingLeft:"10px", gridAutoRows: "minmax(0, 1fr)"}}>                    
                      <div className="relative justify-center items-center flex bg-gray-200 rounded-lg h-32 square-box"  id="drag-1" ></div>                  
                      <div className="bg-gray-200 justify-center items-center flex rounded-lg h-32 square-box" id="drag-2"></div>
                  </div>                  
                  <div className="h-s" >    
                  <Droppable droppableId="A">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                           {containers.A.map((item, index) => (
                              item.isDraggable ? (
                                <Draggable key={key} draggableId={item.id} index={index}>
                                  {(provided) => (
                                     <div
                                     {...provided.draggableProps}
                                     {...provided.dragHandleProps}
                                     ref={provided.innerRef}
                                     className="bg-gray-200 rounded-lg h-32 flex items-center justify-center square-box DropTarget"
                                     id="drag-3"
                                     style={{ background: "#3D8641", ...provided.draggableProps.style }}
                                   >
                                   </div>
                                  )}
                                </Draggable>
                              ) : (
                                <div key={item.id} className="bg-gray-200 rounded-lg h-32 flex items-center justify-center square-box DropTarget">
                                  {item.content} (Inside)
                                </div>
                              )
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>    
                  </div>
                  <div className="h-s" >                    
                    <div className="bg-gray-200 rounded-lg h-32 justify-center items-center flex items-center justify-center square-box" ></div>
                  </div>
                  <div>
                        <div className="bg-gray-200 justify-center items-center flex rounded-lg h-32 rectangle-box" ></div>                      
                  </div>      
                  <div className="h-r">
                  <Droppable droppableId="B">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          {containers.B.map((item, index) => (
                              item.isDraggable ? (
                                <Draggable key={key} draggableId={item.id} index={index} >
                                  {(provided) => (
                                      <div
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                      className="bg-gray-200 justify-center items-center flex rounded-lg h-32 col-span-2 long-rectangle"
                                      id="drag-6"
                                      style={{ background: "#5691E8", ...provided.draggableProps.style }}
                                    >
                                    </div>
                                  )}
                                </Draggable>
                              ) : (
                                <div key={item.id} className="bg-gray-200 justify-center items-center flex rounded-lg h-32 col-span-2 long-rectangle">
                                  {item.content} (Inside)
                                </div>
                              )
                            ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>   
                  </div>  
                  <div className="bg-gray-200 rounded-lg justify-center items-center flex h-32 col-start-2 col-span-2 ph DropTarget" newclass="bg-gray-200 sph col-span-2 ph" id="drag-7"></div> 
                </DragDropContext>
            </div>  

            {/* Right Control Buttons */} 
            <div className="absolute top-4 right-4 flex space-x-2">          
              <div className="bg-black blackbox" >              
                    <button style={{borderRadius:"7px",marginLeft:"4px",background:"white  !important", color:"black !important", marginTop:"3px"}} className="bg-black text-white p-2 ">
                      <FaDesktop />
                    </button>
                  <button className="bg-black text-white p-2 " style={{marginLeft: "9px", fontSize:"18px"}}>         
                    <FaTablet />
                  </button>
                  <button className="bg-black text-white p-2 " style={{marginLeft: "-5px", fontSize:"18px"}}>         
                    <FaMobile />
                  </button>
              </div> 
            </div>
            <div id="addMdl"  className="absolute add-modal bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <div>
                  <div className="single">
                      <FaPlus style={{marginTop:"20px", marginLeft: "20px"}}></FaPlus>
                  </div>
                  <span style={{top:"74px", position:"absolute", left:"17px"}}>Single</span>
                </div>
                <div>
                  <div className="stack">
                    <div className="stack-inner"> 
                    <FaPlus style={{marginTop:"24px", marginLeft: "24px"}}></FaPlus>
                    </div>                     
                  </div>
                  <span style={{top:"74px", position:"absolute", left:"102px"}}>Stack</span>
                </div>
                <div>
                  <div className="single" style={{left:"160px !important"}}>
                     <span className="t-text">T</span>
                  </div>
                  <span style={{top:"74px", position:"absolute", left:"170px"}}>Note</span>
                </div>
                <div>
                  <div className="divider">
                     <div className="t-text-divider"><span className="t-text" style={{marginLeft: "17px"}}>T</span></div>
                  </div>
                  <span style={{top:"74px", position:"absolute", left:"237px"}}>Divider</span>
                </div>                
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
              <div className="addbox" > 
                  <span style={{marginLeft: "21px"}}><FontAwesomeIcon icon={faTableCells} style={{marginLeft: "4px"}} /><p style={{margin: "-30px 0px 0px 0px", marginLeft:"53px;"}}>Add</p></span> 
              </div>
              <span className="half-circle" ><FontAwesomeIcon style={{marginLeft: "7px", color:"black", fontSize:"15px"}} icon={faCircleHalfStroke} /></span><span style={{fontSize:"30px", marginLeft:"22px"}} ><FaImages /></span><span style={{marginLeft:"22px"}} ><div className="rainbow"></div></span>
            </div>
          </div>
        </div>

        {/* Modal */}
        <div className="modal" id="stackMdl">
          <div class="modal-content" id="mdl">
            <div className="col-lg-12" style={{marginBottom: "30px"}}>
                <div className="row">
                  <div className="col-lg-6"><input className="modalInput" type="text" placeholder="Add title"></input></div>
                  <div className="col-lg-6"><div style={{width: "18px", height: "24px", float: "right"}}><button id="btnCloseMdl" style={{fontSize:"20px", borderRadius: "7px"}} className="absolute bg-black text-white p-2" ><FaTimes></FaTimes></button></div></div>
                </div>
              </div>
              <div className="grid grid-cols-6" >
                
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center space-x-2 add-container">
              <div className="addbox"> 
                  <span style={{marginLeft: "21px"}}><FontAwesomeIcon icon={faTableCells} style={{marginLeft: "4px"}} /><p style={{margin: "-30px 0px 0px 0px", marginLeft:"53px;"}}>Add</p></span> 
              </div>
              <span className="half-circle" ><FontAwesomeIcon style={{marginLeft: "7px", color:"black", fontSize:"15px"}} icon={faCircleHalfStroke} /></span><span style={{fontSize:"30px", marginLeft:"22px"}} ><FaImages /></span><span style={{marginLeft:"22px"}} ><div className="rainbow"></div></span>
            </div>
            </div>
        </div>
    </div> 
  );
}
