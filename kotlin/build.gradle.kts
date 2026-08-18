plugins {
    kotlin("jvm") version "2.0.0"
    kotlin("plugin.serialization") version "2.0.0"
    id("maven-publish")
}

group = "com.shipzy"
version = "2.0.2"

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:tor-client-core:2.3.12")
    implementation("io.ktor:tor-client-cio:2.3.12")
    implementation("io.ktor:tor-client-content-negotiation:2.3.12")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
    testImplementation(kotlin("test"))
}

tasks.test {
    useJUnitPlatform()
}

kotlin {
    jvmToolchain(17)
}

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])
            pom {
                name.set("Shipzy SDK for Kotlin")
                description.set("Official Shipzy logistics platform SDK for Kotlin")
                url.set("https://github.com/alaikis/shipzy-sdks")
                licenses {
                    license {
                        name.set("MIT License")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                }
            }
        }
    }
}
