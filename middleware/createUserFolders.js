const fs = require('fs');


module.exports = (newUser) => {
    
    if (!fs.existsSync('./images/users')) {
        // Create directory ./images
        fs.mkdir(`./images/users`, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("New directory successfully created.")
            }
        }) 
    }
    
    // Create directory images/users/user-ID
    fs.mkdir(`./images/users/id-${newUser.id}`, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("New directory successfully created.")

            // Create directory images/users/user-ID/profile
            fs.mkdir(`./images/users/id-${newUser.id}/profile`, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")

                    // Create directory images/users/user-ID/profile/profile-pic
                    fs.mkdir(`./images/users/id-${newUser.id}/profile/profile-pic`, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log("New directory successfully created.")
                        }
                    })
                }
            })
            // Create directory images/users/user-ID/publications
            fs.mkdir(`./images/users/id-${newUser.id}/publications`, function(err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("New directory successfully created.")
                }
            }) 
        }
    })
}
