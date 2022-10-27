class camera{

    constructor(speed){

        this.roll = 0.0;
        this.pitch = 0.0;
        this.yaw = 0.0;

        this.speed = speed ?? 0.01;

        this.view = new Mat4();

        this.position = new Vec4(0, 0, 0);

    }

    updateRoll(direction){

        return this.roll += direction;

    }

    updatePitch(direction){

        return this.pitch += direction;

    }

    updateYaw(direction){

        return this.yaw += direction;

    }

}