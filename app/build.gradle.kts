plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace = "ma.fst.enscantine"

    compileSdk = 36

    defaultConfig {
        applicationId = "ma.fst.enscantine"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner =
            "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        debug {
            buildConfigField("String", "BASE_URL", "\"http://10.0.2.2:5000/\"")
        }

        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            buildConfigField("String", "BASE_URL", "\"http://192.168.8.19:5000/\"")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
}

dependencies {

    // Core UI
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.activity:activity:1.9.2")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.constraintlayout:constraintlayout:2.2.0")

    // Lists
    implementation("androidx.recyclerview:recyclerview:1.3.2")
    implementation("androidx.cardview:cardview:1.0.0")
    implementation("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")

    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")

    // Glide
    implementation("com.github.bumptech.glide:glide:4.16.0")
    annotationProcessor(
        "com.github.bumptech.glide:compiler:4.16.0"
    )

    // Lifecycle
    implementation(
        "androidx.lifecycle:lifecycle-livedata-ktx:2.8.6"
    )
    implementation(
        "androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.6"
    )

    // Room
    implementation("androidx.room:room-runtime:2.6.1")
    annotationProcessor(
        "androidx.room:room-compiler:2.6.1"
    )

    // Navigation
    implementation(
        "androidx.navigation:navigation-fragment:2.8.3"
    )
    implementation(
        "androidx.navigation:navigation-ui:2.8.3"
    )

    // Tests
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation(
        "androidx.test.ext:junit:1.2.1"
    )
    androidTestImplementation(
        "androidx.test.espresso:espresso-core:3.6.1"
    )
}