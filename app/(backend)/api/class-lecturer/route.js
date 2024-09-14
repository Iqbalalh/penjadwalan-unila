import prisma from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const classLecturers = await prisma.classLecturer.findMany({
      include: {
        lecturer: {
          select: {
            lecturerName: true,
          },
        },
        lecturer2: {
          select: {
            lecturerName: true,
          },
        },
        class: {
          select: {
            className: true,
            classCapacity: true,
            subSubject: {
              select: {
                subject: {
                  select: {
                    subjectCode: true,
                    subjectName: true,
                    studyProgram: {
                      select: {
                        studyProgramName: true,
                        department: {
                          select: {
                            departmentName: true,
                          },
                        },
                      },
                    },
                  },
                },
                subjectType: {
                  select: {
                    typeName: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return NextResponse.json(classLecturers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { idLecturer, idLecturer2, idClass } = await req.json();

    // Validate input
    if (!idLecturer) {
      return NextResponse.json(
        { error: "Lecturer ID is required" },
        { status: 400 }
      );
    }
    if (!idClass) {
      return NextResponse.json(
        { error: "Class ID is required" },
        { status: 400 }
      );
    }
    if (!idLecturer2) {
      return NextResponse.json(
        { error: "Lecturer 2 ID is required" },
        { status: 400 }
      );
    }

    // Create a new class lecturer
    const newClassLecturer = await prisma.classLecturer.create({
      data: {
        idLecturer,
        idLecturer2,
        idClass,
      },
    });

    return NextResponse.json(newClassLecturer, { status: 201 });
  } catch (error) {
    console.error("Error creating class lecturer:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
