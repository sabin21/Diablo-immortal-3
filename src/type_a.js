
import '@/styles/type_a.scss';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import modelIcon from '@/models/logo_icon.glb';
import modelPhoneBody from '@/models/phone_2_body.glb';
import modelPhoneScreen from '@/models/phone_2_screen.glb';
import bg1TextureSrc from '@/textures/back_city.jpg';

let container;
	let camera, scene, renderer, light, light2, clock;
	let video, videoTexture, videoMat, phoneBodyMat, iconRig;

	let mouse = new THREE.Vector2();
	let target = new THREE.Vector2();
	let cameraRig = new THREE.Object3D();
	let windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );;

	init();
//-----------------

function init() {
  	container = document.getElementById( 'container' );

  	const aspect = container.clientWidth/container.clientHeight;
  	camera = new THREE.PerspectiveCamera(35, aspect, 0.01, 1000);
  	camera.position.z = 5;
	camera.lookAt(0,0,-5);
	cameraRig.position.set(0,0,0);
	cameraRig.add(camera);
	//scene.add(cameraRig);

  	scene = new THREE.Scene();
	light = new THREE.PointLight( 0xffffff, 0.1, 100 );
	light.position.set(-0.5 ,0 ,-20);
	light2 = new THREE.PointLight( 0xffffff, 2, 1000 );

	scene.add(light);
	scene.add(light2);
	light2.position.set(2 ,8 ,10);
	scene.add(cameraRig);

	let ang_rad = camera.fov * Math.PI / 180;
    let fov_y = (camera.position.z + 10) * Math.tan(ang_rad / 2) * 2;

	// Background
	const textureLoader = new THREE.TextureLoader();
	const bg1Texture = textureLoader.load(bg1TextureSrc);
	const bg1Geometry = new THREE.PlaneGeometry(fov_y * camera.aspect, fov_y);
	//const bg1Geometry = new THREE.PlaneGeometry(16, 9);

	const bg1Material = new THREE.MeshBasicMaterial({ 
		map: bg1Texture,
		transparent: true,
		opacity : 1 
	});

	const bg1Mesh = new THREE.Mesh(bg1Geometry, bg1Material);	
	bg1Mesh.scale.set(3.4, 3.4, 1);		
	bg1Mesh.position.set(0, 0, -40);
	scene.add(bg1Mesh);
	//
    iconRig = new THREE.Object3D();
    const loader = new GLTFLoader();

    loader.load( modelIcon, function ( gltf ) {
        const iconScene = gltf.scene;
        iconRig.add(iconScene);
    });

    iconRig.position.set(0, 0, -20);
	iconRig.rotation.set(0, 2, 0);
	scene.add(iconRig);
	/*
	const hdrEquirect = new RGBELoader().load(
		"models/empty_warehouse_01_2k.hdr",
			() => {
			hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
		}
	);
    */

	let phoneRig = new THREE.Object3D();
	const loaderPhone = new GLTFLoader();
	const loaderPhoneScreen = new GLTFLoader(); 
	let phoneBodyMesh = null;
	let phoneScreenMesh = null;
	let phoneBodyGeo = null;

	
	loaderPhone.load (modelPhoneBody, (gltf) => {
		const stoneMesh = gltf.scene.children.find((mesh) => mesh.name === "phone_body");
		phoneBodyGeo = stoneMesh.geometry.clone();

		phoneBodyMat = new THREE.MeshPhysicalMaterial({
				color : 0x0E0E0E,
                metalness: 0.5,
				roughness: 0.5,
				transmission: 1,
				ior: 1.3,
				reflectivity: 0.5,
				thickness: 2.5,
				//envMap: hdrEquirect,
				//envMapIntensity: 0.5,
				transparent: true,
				opacity: 1
			});
		phoneBodyMat.opacity = 1;
		phoneBodyMesh = new THREE.Mesh(phoneBodyGeo, phoneBodyMat);				
		phoneRig.add(phoneBodyMesh);
    });
	
	loaderPhoneScreen.load (modelPhoneScreen, (gltf) => {
		const stoneMesh = gltf.scene.children.find((mesh) => mesh.name === "phone_screen");
		const phoneScreenGeometry = stoneMesh.geometry.clone();
		phoneScreenMesh = new THREE.Mesh(phoneScreenGeometry, videoMat);			
		phoneRig.add(phoneScreenMesh);
    });
	phoneRig.position.set(0, 0, -24 );
	phoneRig.rotation.set(0, Math.PI/2, 0 );
	scene.add(phoneRig);

    // video
	video = document.getElementById( 'video' );	
	video.play();
	videoTexture = new THREE.VideoTexture( video, function(video){
		video.wrapS = texture.wrapT = THREE.RepeatWrapping;
		video.offset.set( 0, 0 );
		video.repeat.set(2,2);
	});
	videoMat = new THREE.MeshLambertMaterial({ 
		color:0xffffff, 
		map: videoTexture ,
		transparent: true, 
		opacity: 0.5
	});
	
	clock = new THREE.Clock();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
  	container.appendChild( renderer.domElement );

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onMouseMove, false );

	// ScrollTrigger 
	function scrollAction(){
	gsap.registerPlugin(ScrollTrigger);
	let scene1 = gsap.timeline();
	let sceneHero = gsap.timeline();
	let scenePhone2 = gsap.timeline();
	
	scene1
	.add('start')
	.to(camera.position, { z: -1.5})
	.to(phoneRig.rotation, { y: 0}, 'start')
	.to(phoneRig.position, { z: -9}, 'start')
	.add('middle')
	.to(phoneRig.rotation, { y: -0.2})
	.to('.headline', { opacity: 1}, 'middle');
	ScrollTrigger.create({
		animation: scene1,
		trigger: ".trigger-1",
		start: "top top",
		end : "bottom 30%",
		scrub: true
	});

	sceneHero
	.add('start')
	.to('.visual-1', { x: 400, opacity:0 })
	.to('.visual-2', { x: -350, opacity:0 }, 'start');
	ScrollTrigger.create({
		animation: sceneHero,
		trigger: ".trigger-1",
		start: "top top",
		end : "40% 50%",
		scrub: true
	});

	scenePhone2
	.add('start')
	.to(phoneRig.position, { y: 4, duration: 2})
	.to(bg1Material, { opacity:0, duration: 2}, 'start')
	.to('.headline', { scale: 1.5, duration: 2 }, 'start')
	.add('middle')	
	.to('.headline', { opacity: 0, duration: 2}, 'middle');
	ScrollTrigger.create({
		animation: scenePhone2,
		trigger: ".trigger-2",
		start: "top top",
		end : "bottom 60%",
		scrub: true
	});
}
	let introTL = new gsap.timeline();
	introTL
	.add('start')
	.to(iconRig.position, { z: 0 , duration: 2}, 'start')
	.to(iconRig.rotation, { y: 0 , duration: 1}, 'start')
	.add('middle')
	.to('.visual-1', { opacity: 1, right: 0, duration: 0.5}, 'middle')
	.to('.visual-2', { opacity: 1, left: 0, duration: 0.5, onComplete: scrollAction}, 'middle');
	
	
} // init end ----------------

function onMouseMove( event ) {
	mouse.x = ( event.clientX - windowHalf.x );
	mouse.y = ( event.clientY - windowHalf.x );
}

function onWindowResize( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight ); 
  	const windowWidth  = window.innerWidth;
    const windowHeight = window.innerHeight;  
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
	render();
}

function animate() {
    requestAnimationFrame( animate );
	target.x = ( 1 - mouse.x ) * -0.001;
    target.y = ( 1 - mouse.y ) * -0.001;
            
    iconRig.rotation.x += 0.002 * ( target.y - iconRig.rotation.x );
    iconRig.rotation.y += 0.01 * ( target.x - iconRig.rotation.y );
    render();
};

function render() {
	
  renderer.render( scene, camera );
}

animate();