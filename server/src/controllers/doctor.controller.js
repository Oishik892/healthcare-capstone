const prisma = require("../config/prisma");
const { updateDoctorSchema } = require("../validators/doctor.validator");

const getMyDoctorProfile = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile fetched successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Get my doctor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMyDoctorProfile = async (req, res) => {
  try {
    const parsedData = updateDoctorSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedData.error.flatten(),
      });
    }

    const existingDoctor = await prisma.doctor.findUnique({
      where: { userId: req.user.userId },
    });

    if (!existingDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const { specialization, qualification } = parsedData.data;

    const updatedDoctor = await prisma.doctor.update({
      where: { userId: req.user.userId },
      data: {
        specialization: specialization ?? existingDoctor.specialization,
        qualification: qualification ?? existingDoctor.qualification,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: updatedDoctor,
    });
  } catch (error) {
    console.error("Update my doctor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Get all doctors error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMyDoctorProfile,
  updateMyDoctorProfile,
  getAllDoctors,
};