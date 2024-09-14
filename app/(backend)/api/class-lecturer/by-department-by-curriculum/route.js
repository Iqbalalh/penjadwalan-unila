import prisma from "@/app/(backend)/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get("departmentId");
    const curriculumId = searchParams.get("curriculumId");
    const isTheory = searchParams.get("isTheory") === "true";
    const isPracticum = searchParams.get("isPracticum") === "true";

    // Validate required parameters
    if (!departmentId || !curriculumId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Determine filter for idSubSubject based on isTheory and isPracticum
    let idSubSubjectFilter;
    if (isTheory && isPracticum) {
      idSubSubjectFilter = { in: [1, 2] }; // Both theory and practicum
    } else if (isTheory) {
      idSubSubjectFilter = 1; // Only theory
    } else if (isPracticum) {
      idSubSubjectFilter = 2; // Only practicum
    } else {
      return NextResponse.json(
        { error: "Invalid filter selection" },
        { status: 400 }
      );
    }

    // Fetch class lecturers, including only classes where classCapacity > 0
    const classLecturers = await prisma.classLecturer.findMany({
      where: {
        class: {
          classCapacity: {
            gt: 0,
          },
          subSubject: {
            idSubjectType: idSubSubjectFilter,
            subject: {
              idCurriculum: parseInt(curriculumId),
              studyProgram: {
                department: {
                  id: parseInt(departmentId),
                },
              },
            },
          },
        },
      },
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
            academicPeriod: {
              select: {
                periodName: true,
              },
            },
            subSubject: {
              select: {
                idSubjectType: true,
                subjectType: {
                  select: {
                    id: true,
                    typeName: true,
                  },
                },
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
              },
            },
          },
        },
      },
    });

    // Return the filtered data
    return NextResponse.json(classLecturers, { status: 200 });
  } catch (error) {
    console.error("Error fetching class lecturers:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
