const profileController = {

   
    display: (request, response) => {

        const userID = parseInt(request.params.id);

        // Check if the user is Logged : if he is, call findUser function, if he is not, redirect him to the login page

        if (request.session.data.logguedIn === true) {

            profile.findUser(userID, (error, data) => {

                // If everything is OK, render the myProfile page
                if (error === null && data.rows.length > 0) {
                    response.render('myProfile', {
                        userInfo: data.rows[0],
                    });
                } 
                // Else, redirect the user to the login page
                else {
                    response.redirect('/login');
                }
            });
        }
        // If user is not logged, redirect to login page
        else {
            response.redirect('/login');
        }
        
    }
};

module.exports = profileController;