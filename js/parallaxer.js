(function(window) {
    function Parallaxer(stage, xRange, yRange) {
        this._stage = stage;
        this._range = {
            x: xRange || Parallaxer.X_RANGE,
            y: yRange || Parallaxer.Y_RANGE
        };
        this._transitioning = false;
        this._lastCursor = null;

        window.addEventListener('devicemotion', this._onDeviceMove.bind(this), true);
        window.addEventListener('mousemove', this._onMouseMove.bind(this), true);
    }

    Parallaxer.X_RANGE = 0.1; // Move at most 1/10 window width in x direction
    Parallaxer.Y_RANGE = 0.2; // Move at most 1/5 window height in y direction
    Parallaxer.TRANSITION = 'all .01s linear';
    Parallaxer.TRANSITION_DIST_SQ = 200 * 200; // Minimum distance before applying a transition effect

    Parallaxer.prototype = {
        _onDeviceMove: function(e) {
            console.log('deviceMove');
        },

        _transition: function() {
            this._transitioning = true;
            this._stage.style.WebkitTransition = Parallaxer.TRANSITION;
            window.addEventListener('webkitTransitionEnd', this._onEndTransition.bind(this), true);
        },

        _onEndTransition: function() {
            this._stage.style.WebkitTransition = '';
            this._transitioning = false;
        },

        _onMouseMove: function(e) {
            if (!this._lastCursor) { // Transition to initial mouse coordinates
                this._transition();
            }
            else if (!this._transitioning) {
                var dx = e.clientX - this._lastCursor.x,
                    dy = e.clientY - this._lastCursor.y;
                
                // Transition if distance between mouse events is large
                if (dx * dx + dy * dy > Parallaxer.TRANSITION_DIST_SQ) {
                    this._transition();
                }
            }

            var x = -(e.clientX / window.innerWidth - 0.5) * window.innerWidth * this._range.x,
                y = -(e.clientY / window.innerHeight - 0.5) * window.innerHeight * this._range.y;

            this._stage.style.WebkitTransform = 'translate(' + x + 'px,' + y + 'px)';
            this._lastCursor = {x: e.clientX, y: e.clientY};
        }
    };

    window.Parallaxer = Parallaxer;
})(window);
