<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Atto text editor integration version file.
 *
 * @package    atto_subtitle
 * @copyright  2018 Justin Hunt <poodllsupport@gmail.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();


use atto_subtitle\constants;
use atto_subtitle\utils;

/**
 * Initialise this plugin
 * @param string $elementid
 */
function atto_subtitle_strings_for_js() {
    global $PAGE;

    $PAGE->requires->strings_for_js(
        array('insert','cancel','audio','video','subtitle',
            'subtitleinstructions','audio_desc','video_desc'), constants::M_COMPONENT);
}

/**
 * Return the js params required for this module.
 * @return array of additional params to pass to javascript init function for this module.
 */
function atto_subtitle_params_for_js($elementid, $options, $fpoptions) {
	global $COURSE;

	$config = get_config('atto_subtitle');

	//coursecontext
	$coursecontext=context_course::instance($COURSE->id);

    $params = array();
    //insert methdd
   // $params['insertmethod']=$config->insertmethod;

    //add icon to editor if the permissions and settings are ok
     $params['disabled']=true;
    $enablesubtitling = get_config('atto_subtitle','enablesubtitling');
    if($enablesubtitling && has_capability('atto/subtitle:visible', $coursecontext)){
        $params['disabled']=false;
    }

    return $params;
}
