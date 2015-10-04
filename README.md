React-Observable
================
A React extension that allows separated/hierarchically non-bound components to share *state properties*. This is particularly useful when dealing with separated `Components` that should keep to update each other, even though being placed separately in the page. 

In order to do so the library takes advantage of the `Component`'s [`mixins`](https://facebook.github.io/react/docs/reusable-components.html#mixins) property.


How to use
==========
Let's assume we want to share a state property called `alertmsg` between two Components.  Whether Component1 or Component2 changes its value, both Components should be aware of the state change. This library helps you to do so. First of all let's create the Object that has to be used in the Components' `mixins`:

	// By calling Tmb.lib.Observable(<initial_value>, <var_name>) we create the object that will be used in the Components' mixins in order to share the property: in this case the shared state property will be called *alertmsg* having an initial value of null
	var alert_msg = Tmb.lib.Observable(null, 'alertmsg');

	// in order to use alertmsg we have to call <obj>.mixin() so as to access alertmsg in our state object and integrate the functionalities we need to share it among components
    var Form = React.createClass({
    	mixins: [alert_msg.mixin()],

        
        handleSubmit : function(e) {
            var errors = [];
            e.preventDefault();

            //alertmsg can change its value and the Components using it will change their state (and they will be re.rendered eventually). In this case we set the message to null, by emptying any error message our front-end application could have generated
            this.state.alertmsg.ops.set(null);

            var discount_name = React.findDOMNode(this.refs.discount_name).value.trim();
            if (!discount_name)
            {
                errors.push(this.props.l.no_voucher_code);

                //alertmsg can change its value and the Components using it will change their state (and they will be re.rendered eventually). In this case we're setting an array of errors that it will be rendered by the second Component sharing this variable
                this.state.alertmsg.ops.set(errors);
            }
        }
    });

    var Errors = React.createClass({
    	//here we are again: alert_msg is now shared with Form: they both can change its value and their states are related to this property as well
        mixins: [alert_msg.mixin()],

        //render will be called each time alert_msg changes. In this case when Form.handleSubmit fills alert_msg with some errors. Note that Errors and Form are not hierarchically related! 
        render: function() {
            var style = (this.state.alertmsg.value === null) ? {display: 'none'} : {display: 'block'};
            var alerts = [];

            if(this.state.alertmsg.value !== null)
                this.state.alertmsg.value.forEach(function(el) {
                    alerts.push(<li dangerouslySetInnerHTML={{__html: el}}></li>)
                });

            return(
                <div style={style} className="alert alert-danger">
                    <p>
                        {this.props.l.there_are} {alerts.length} {this.props.l.errors}
                    </p>

                    <ol>
                        {alerts}
                    </ol>
                </div>
            );
        }
    });

    React.render(React.createElement(Form), document.getElementById('form'));
    React.render(React.createElement(Errors), document.getElementById('errors'));