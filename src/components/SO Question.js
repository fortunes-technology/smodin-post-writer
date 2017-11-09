
return (
    <div className='flexbox-parent-console overflow-hidden'>
        <div className='b--light-gray bw2 b--solid w275p bg-white pa2 overflow-auto'>
            <SocialPostExamplesArray />
        </div>
        <div className='flex-column bg-gray w25p content-around self-center'>
            <div className='post-side-tab-chosen vertical-lr'>Tab 1</div>
            <div className='post-side-tab vertical-lr'>Tab 2</div>
        </div>
    </div>
)

CSS:
.flexbox-parent-console {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start; /* align items in Main Axis */
    align-items: stretch; /* align items in Cross Axis */
    align-content: stretch; /* Extra space in Cross Axis */
}
.self-center {
    -ms-flex-item-align: center;
    align-self: center
}
.overflow-hidden {
    overflow: hidden
}
.fill-area-content {
    overflow: auto;
}
.r90 {
    -webkit-transform: rotate(-90deg);
    -ms-transform: rotate(-90deg);
    -moz-transform: rotate(-90deg);
    -o-transform: rotate(-90deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}
.rotateddiv {
    width 300px;
    height: 24px;
    text-align: center;
    background: green;
}
//Non Essentials
.b--light-gray {
    border-color: #eee
}
.bg-black-10 {
    background-color: rgba(0, 0, 0, .1)
}
.bw2 {
    border-width: .25rem
}
.b--solid {
    border-style: solid
}
.pa2 {
    padding: .5rem
}
