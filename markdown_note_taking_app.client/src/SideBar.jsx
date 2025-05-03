import './SideBar.css'
function SideBar() {




    return (
      <div className="side-bar">
            <button className="side-bar-buttons"><img src="/assets/button_icons/add_file.png" className="side-bar-icons"></img></button>
            <button className="side-bar-buttons"><img src="/assets/button_icons/delete_file.png" className="side-bar-icons"></img></button>
            <button className="side-bar-buttons"><img src="/assets/button_icons/edit_file.png" className="side-bar-icons"></img></button>

            <div id="file-list">
                
            </div>


      </div>
  );
}

export default SideBar;