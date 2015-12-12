<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		//$this->load->view('welcome_message');
		header('Content-type: application/json');
		$data1 = array( 'a', 'b', 'c' );
		$data2 = array( 'name' => 'God', 'age' => -1 );
		$option = 1;
		//header('Content-type: application/json');
		if ( $option == 1 )
			echo json_encode( $data1 );
		// prints json array ["a","b","c"]
		else
			echo json_encode( $data2 );
		// prints json object {"name":"God","age":-1}
	}
}
