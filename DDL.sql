CREATE TABLE `user`(
    userID int NOT Null AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL CHECK (email LIKE "_%@__%.__%"),
    password varchar(255) NOT NULL,
    DOB date,
    phoneNumber varchar(15),
    expat bit default 0,
    PRIMARY KEY (userID)
);

CREATE TABLE car(
    plateID varchar(20) NOT NULL UNIQUE,
    status varchar(20) default 'available',
    rentVal int NOT NULL,
    year int NOT NULL,
    producer varchar(20) NOT NULL,
    model varchar(20) NOT NULL,
    color varchar(20) NOT NULL,
    millageOnFullTank int NOT NULL,
    fuelType varchar(20) NOT NULL,
    noOfSeats int NOT NULL, 
    type varchar(20) NOT NULL,
    
    PRIMARY KEY (plateID)
);

CREATE TABLE reservetion(
    userID int NOT Null,
    plateID varchar(20) NOT NULL,
    recieveDate date NOT NULL,
    returnDate date,
    payment int,

    PRIMARY KEY (userID, plateID, recieveDate),
    FOREIGN KEY (userID) REFERENCES `user`(userID),
    FOREIGN KEY (plateID) REFERENCES car(plateID)
);