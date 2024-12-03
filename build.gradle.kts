plugins {
    id("com.android.application") version "8.0.2" apply false // La versión de AGP
    id("org.jetbrains.kotlin.android") version "1.9.0" apply false // La versión del Kotlin plugin
}

allprojects {
    repositories {
    }
}

subprojects {
    afterEvaluate {
        // Si necesitas configuraciones adicionales para subproyectos, las puedes agregar aquí.
    }
}
