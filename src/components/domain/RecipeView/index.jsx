//==============================================================================
import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from 'react-router-dom';
import _ from "lodash";
import moment from "moment";
import ReactStars from "react-rating-stars-component";
//==============================================================================
import RecipeReview from "../../reusable/Review/index.jsx";
import Input from "../../reusable/Input/index.jsx";
import Button from "../../reusable/Button/index.jsx";
import ModalConfirm from "../../reusable/Modals/ModalConfirm.jsx";

import RecipeContext from "../../../context/recipe-context";

import { isAnyEmpty, convertTimestampToDate } from "../../../utils/Helpers"

import {
  DISCOVER__ROUTE_PATH,
} from "../../../data/urls"

import {
  RecipeView,
  // main info
	RecipeMainInformation,
	RecipeImage,
	RecipeName,
	RecipeDescription,
  RecipeAuthorData,
  RecipeAuthorAvatar,
  RecipeAuthorUsername,
  RecipeDate,
  ButtonsContainer,
  // details
  RecipeDetails,
  TitleLabel,
  RecipeIngredients,
  IngredientData,
  IngredientName,
  IngredientQuantity,
	RecipeSteps,
  Step,
  // reviews
  ReviewStickyContainer,
  RatingInput,
  RecipeReviews,
} from "./style"
//==============================================================================

function _RecipeView() {

  const context = useContext(RecipeContext);
  const { recipeId } = useParams();
  const history = useHistory();

  const { name:recipeName, description, image, steps, avg_rating } = (context.selectedRecipe || {});
  const { total_ratings, createdAt, authorName, authorAvatar, authorId } = (context.selectedRecipe || {});

	const [newRecipeRating, setNewReviewRating] = useState(null);
  const [newReviewText, setNewReviewText] = useState("");
  // UX
  const [isReviewTextMissing, setIsReviewTextMissing] = useState(false);
  const [isViewingIngredients, setIsViewingIngredients] = useState(true);

  useEffect(() => {
    const unsubscribeFromGetRecipe = context.GetRecipe(recipeId);
    const unsubscribeFromGetRecipeReviews = context.GetRecipeReviews(recipeId);
    const unsubscribeFromGetRecipeIngredients = context.GetRecipeIngredients(recipeId);
    return () => {
      unsubscribeFromGetRecipe && unsubscribeFromGetRecipe();
      unsubscribeFromGetRecipeReviews && unsubscribeFromGetRecipeReviews();
      unsubscribeFromGetRecipeIngredients && unsubscribeFromGetRecipeIngredients();
    }
  }, [])  

  const ratingChanged = (newRating) => {
		setNewReviewRating(newRating)
  };
	const createReview = () => {
    if (isAnyEmpty(newReviewText) || newRecipeRating===null) {
      setIsReviewTextMissing(true);
      return;
    }
    setIsReviewTextMissing(false);
    // Create recipe review
		const newRecipeReview = {
      text: newReviewText,
      rating: newRecipeRating,
      authorName,
      authorAvatar,
      authorId,
    }
    context.CreateRecipeReview(recipeId, newRecipeReview);
    setNewReviewText("");
    setNewReviewRating(null);
  }
  const toggleRecipeDetailsView = () => {
    setIsViewingIngredients(!isViewingIngredients);
  }
    
  return (
    <RecipeView>
			<RecipeMainInformation>
				<RecipeImage src={_.get(image, "url")} alt="Recipe Image"/>
				<RecipeName> {recipeName} </RecipeName>
				<RecipeDescription> {description} </RecipeDescription>
        <div style={{ alignSelf:"flex-end",display:"flex",justifyContent:"flex-start",alignItems:"center" }}>
          <ReactStars
            count={5}
            value={avg_rating}
            isHalf={true}
            edit={false}
            size={24}
            activeColor={window.colors["app__rateStarColor"]}
          />  
          <span style={{ marginLeft:5,fontSize:16 }}> {`(${total_ratings || 0})`} </span>
        </div>
					<RecipeAuthorData>
							<span style={{ marginRight:20, fontWeight:800 }}>Author: </span>
							<RecipeAuthorAvatar src="/images/user-placeholder.jpg" alt="Author Avatar"/>
							<RecipeAuthorUsername> {_.get(context, "loggedUser.")} </RecipeAuthorUsername>
					</RecipeAuthorData>
					<RecipeDate>
							<span style={{ marginRight:20, fontWeight:800 }}>Created At: </span>
							<RecipeAuthorUsername> 
                {moment(convertTimestampToDate(createdAt)).format('MMMM Do YYYY, h:mm a')}
              </RecipeAuthorUsername>
					</RecipeDate>
          <ButtonsContainer>
            <Button 
              type="warning"
              onClick={() => {}}
              text="Edit"		
            />            
            <Button 
              type="danger"
              onClick={() => {
                context.ToggleModal({
                  title: "Do you want to delete this Recipe?",
                  content: <ModalConfirm 
                      onYesLabel="Delete Recipe"
                      onYesFunction={() => {
                          context.ToggleModal();
                          // context.DeleteRecipe
                          //   .then(() => {
                          //     history.push(DISCOVER__ROUTE_PATH);
                          //   })
                      }}
                  />
              })}}
              text="Delete"			
              style={{ marginLeft:15, marginRight:20 }}
            />            
          </ButtonsContainer>          
			</RecipeMainInformation>
      
      <RecipeDetails>
        <RecipeIngredients
          onClick={() => { !isViewingIngredients && toggleRecipeDetailsView() }}
          isViewing={isViewingIngredients}
        >
          <TitleLabel> Ingredients </TitleLabel>
          {_.map(context.selectedRecipeIngredients, (ingredient) => {
            const { name, quantity, id } = ingredient;
            return(
              <IngredientData key={id}>
                <IngredientName>{name}</IngredientName>
                :
                <IngredientQuantity>{quantity}</IngredientQuantity>
              </IngredientData>
            )
          })}
        </RecipeIngredients>
        <RecipeSteps
          onClick={() => { isViewingIngredients && toggleRecipeDetailsView() }}
          isViewing={!isViewingIngredients}
        >
          <TitleLabel> Steps </TitleLabel>
          {_.map(steps, (step, i) => <Step key={i}> {step} </Step> )}
        </RecipeSteps>
      </RecipeDetails>

			<RecipeReviews>
        <ReviewStickyContainer>
          <Input 
              label="Rate the Recipe:"
              placeholder="Review"
              onChange={(e) => setNewReviewText(e.target.value)}
              value={newReviewText}
              style={{ background:"white", marginBottom:5 }}
              checkForMissingField={isReviewTextMissing}
          />
          <RatingInput error={isReviewTextMissing && newRecipeRating===null}>
            <ReactStars
              count={5}
              value={newRecipeRating}
              isHalf={true}
              size={22}
              activeColor={window.colors["app__rateStarColor"]}
              onChange={ratingChanged}
            />  
          </RatingInput>
          <Button 
            type="warning"
            onClick={() => createReview()}
            text="Create Review"
            style={{ width:"100%" }}				
          />
        </ReviewStickyContainer>
				{_.map(context.selectedRecipeReviews, (review) => {
					const { id, authorAvatar, authorName:reviewAuthorName, text, rating, createdAt } = review;
					return <RecipeReview 
						key={id}
						authorAvatar={authorAvatar}
						authorName={reviewAuthorName}
						text={text}
						rating={rating}
						createdAt={createdAt}
					/>			
				})}
			</RecipeReviews>
    </RecipeView>
  );
}

export default _RecipeView;
